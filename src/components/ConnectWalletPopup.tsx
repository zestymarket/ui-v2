import React, { useEffect, useRef, useState } from 'react';
import {
  Backdrop,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RightArrowIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';

import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { addRPC, getENSOrWallet } from '../utils/hooks';

import {
  injected,
  walletconnect,
  walletlink,
  torus,
} from '../utils/connectors';

import MetaMaskOnboarding from '@metamask/onboarding';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  setAddress: (address: string) => void;
}

interface WalletProps {
  title: string;
  image: string;
  subtitle: string;
  onSelect: () => void;
}

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: 32,
    width: 440,
    backgroundColor: `#fff`,
  },
});

const StyledBackdrop = styled(Backdrop, {
  name: `MuiModal`,
  slot: `Backdrop`,
  overridesResolver: (props, styles) => {
    return styles.backdrop;
  },
})({
  zIndex: -1,
  background: `rgba(19, 16, 30, 0.8)`,
  backdropFilter: `blur(18px)`,
  webkitBackdropFilter: `blur(18px)`,
});

const StyledTitle = styled(DialogTitle)({
  color: `#050407`,
  fontSize: 26,
  fontWeight: 700,
  padding: `0 0 32px`,
});

const StyledIconButton = styled(IconButton)({
  position: `absolute`,
  right: 16,
  top: 16,
  backgroundColor: `#837C99`,
  borderRadius: `50%`,
  padding: 4,
  color: `#fff`,
  '& svg': {
    height: 16,
    width: 16,
  },
});

const StyledContent = styled(DialogContent)({
  padding: `32px 0 0`,
});

const StyledFooterTitle = styled(Typography)({
  fontSize: 15,
  color: `#050407`,
  marginTop: 40,
  marginBottom: 4,
});

const StyledFooterLink = styled(Typography)(({ theme }) => ({
  fontSize: 15,
  fontWeight: 600,
  color: theme.palette.secondary.main,
}));

// Wallet Option
const StyledWallet = styled(Grid)({
  borderBottom: `1px solid rgba(131, 124, 153, 0.2)`,
  padding: `12px 0`,
  userSelect: `none`,
  cursor: `pointer`,
  '.imageContainer': {
    transition: `padding-left 0.3s ease`,
  },
  ':hover .imageContainer': {
    paddingLeft: 10,
  },
});

const StyledWalletTitle = styled(Typography)({
  color: `#050407`,
  fontSize: 15,
  fontWeight: 600,
});

const StyledWalletSubtitle = styled(Typography)({
  color: `#5F5777`,
  fontSize: 15,
  fontWeight: 400,
});

const StyledRightArrow = styled(RightArrowIcon)({
  width: 12,
  height: 12,
});

const WalletOption: React.FC<WalletProps> = ({
  title,
  image,
  subtitle,
  onSelect,
}) => {
  return (
    <StyledWallet container onClick={onSelect}>
      <Grid className={`imageContainer`} item>
        <Image src={image} alt={title} width={48} height={48} />
      </Grid>
      <Grid item flex={1} marginLeft={2}>
        <StyledWalletTitle>{title}</StyledWalletTitle>
        <StyledWalletSubtitle>{subtitle}</StyledWalletSubtitle>
      </Grid>
      <Grid item>
        <StyledRightArrow htmlColor="#050407" fontSize="small" />
      </Grid>
    </StyledWallet>
  );
};

const ConnectWalletPopup: React.FC<PopupProps> = ({
  open,
  onClose,
  setAddress,
}) => {
  const { active, error, activate, library, account, setError } =
    useWeb3React<Web3Provider>();
  const [, setProvider] = useState<Web3Provider>();
  const [, setConnecting] = useState<boolean>(false);

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();
  useEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  // Stop onboarding if there's an error
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
      onClose();
    }

    if (active && !error && library) {
      setProvider(new Web3Provider(library.provider));
    } else if (!active) {
      setAddress(``);
    }
  }, [active, error, library, onClose, setAddress]);

  useEffect(() => {
    if (account) {
      setAddress(account);
      getENSOrWallet(account).then((addr) => {
        setAddress(addr);
      });
    }
  }, [account, setAddress]);

  return (
    <StyledDialog
      BackdropComponent={StyledBackdrop}
      BackdropProps={{
        timeout: 500,
      }}
      open={open}
      onClose={onClose}
    >
      <StyledTitle>
        Connect Wallet
        <StyledIconButton aria-label="close" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </StyledIconButton>
      </StyledTitle>
      <StyledContent>
        <DialogContentText>Please select your wallet:</DialogContentText>
        <WalletOption
          title="Metamask"
          subtitle="Connect using browser wallet"
          image="/logo/metamask-logo.png"
          onSelect={() => {
            if (error instanceof UnsupportedChainIdError) {
              // Currently only Polygon and Rinkeby are supported, please switch networks and refresh before connecting// ,
              return;
            }

            setConnecting(true);
            activate(injected, undefined, true).catch((error) => {
              // ignore the error if it's a user rejected request
              if (error instanceof UserRejectedRequestError) {
                setConnecting(false);
              } else {
                setError(error);
              }
            });
            onClose();

            // If not installed
            // onboarding.current?.startOnboarding();
          }}
        />
        <WalletOption
          title="Coinbase Wallet"
          subtitle="Connect using Coinbase wallet"
          image="/logo/coinbase-logo.png"
          onSelect={(): void => {
            setConnecting(true);
            activate(walletlink)
              .then(() => {
                addRPC(library, `polygon`);
                setConnecting(false);
              })
              .catch((error) => {
                setConnecting(false);
                setError(error);
              });
            onClose();
          }}
        />
        <WalletOption
          title="Wallet Connect"
          subtitle="Connect using Wallet Connect"
          image="/logo/walletconnect-logo.png"
          onSelect={(): void => {
            console.log(`err`, error);
            if (error instanceof UnsupportedChainIdError) {
              // Currently only Polygon mainnet and Rinkeby testnet are supported, please switch networks and refresh before connecting
              return;
            }
            // Subsequent calls to activate will be rejected, if user previously closed the prompt.
            // This has been fixed in the latest package. Another bug causes crashing issues, so we stay at 6.2.8 for now
            activate(walletconnect).catch((error) => {
              if (error instanceof UserRejectedRequestErrorWalletConnect) {
                setConnecting(false);
              } else {
                setError(error);
              }
            });
          }}
        />
        <WalletOption
          title="Torus (Web2 Auth)"
          subtitle="Connect using Torus"
          image="/logo/torus-logo.png"
          onSelect={(): void => {
            setConnecting(true);
            activate(torus)
              .then(() => {
                setConnecting(false);
                addRPC(library, `polygon`);
              })
              .catch((error) => {
                setConnecting(false);
                setError(error);
              });
            onClose();
          }}
        />
        <StyledFooterTitle>New to Ethereum?</StyledFooterTitle>
        <StyledFooterLink>Learn more about wallets</StyledFooterLink>
      </StyledContent>
    </StyledDialog>
  );
};

export default ConnectWalletPopup;
