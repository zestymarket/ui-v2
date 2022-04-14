import React, { useState } from 'react';
import { styled, Grid } from '@mui/material';
import Logo from './Logo';
import HeaderTab from './HeaderTab';
import Button from './Button';
import ConnectWalletPopup from './ConnectWalletPopup';
import { shortenHex } from '@/utils/helpers';

const StyledButton = styled(Button)({
  background: `linear-gradient(112.17deg, rgba(248, 151, 36, 0.16) 0%, rgba(226, 63, 38, 0.16) 100%)`,
});

const Header = () => {
  const [connectWalletPopup, showConnectWalletPopup] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(``);

  const onClickConnectWallet = () => showConnectWalletPopup(true);
  const onCloseConnectWallet = () => showConnectWalletPopup(false);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        sx={{ py: 3, backgroundColor: `#181522` }}
      >
        <Grid container sx={{ maxWidth: 1400, margin: `auto` }}>
          <Grid
            container
            item
            xs={5}
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Logo />
            <HeaderTab label="Marketplace" selected />
            <HeaderTab label="Dashboard" highlighted />
            <HeaderTab label="Governance" />
          </Grid>

          <Grid
            container
            item
            xs={7}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button outlined onClick={() => null}>
              Buy USDC
            </Button>
            <Button outlined onClick={() => null}>
              Network
            </Button>
            {!address.length && (
              <Button onClick={onClickConnectWallet}>Connect Wallet</Button>
            )}
            {!!address.length && (
              <StyledButton outlined onClick={() => null}>
                {address.endsWith(`.eth`) ? address : shortenHex(address, 4)}
              </StyledButton>
            )}
          </Grid>
        </Grid>
      </Grid>
      <ConnectWalletPopup
        open={connectWalletPopup}
        onClose={onCloseConnectWallet}
        setAddress={setAddress}
      />
    </>
  );
};

export default Header;
