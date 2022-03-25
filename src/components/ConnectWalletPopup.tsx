import React from 'react';
import {
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

interface PopupProps {
  onClose: () => void;
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
      <Grid item>
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

const ConnectWalletPopup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <StyledDialog open onClose={onClose}>
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
          image="/metamask-logo.png"
          onSelect={() => null}
        />
        <WalletOption
          title="Coinbase Wallet"
          subtitle="Connect using Coinbase wallet"
          image="/coinbase-logo.png"
          onSelect={() => null}
        />
        <StyledFooterTitle>New to Ethereum?</StyledFooterTitle>
        <StyledFooterLink>Learn more about wallets</StyledFooterLink>
      </StyledContent>
    </StyledDialog>
  );
};

export default ConnectWalletPopup;
