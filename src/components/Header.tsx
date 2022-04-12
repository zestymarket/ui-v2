import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Logo from './Logo';
import HeaderTab from './HeaderTab';
import Button from './Button';
import ConnectWalletPopup from './ConnectWalletPopup';

const Header = () => {
  const [connectWalletPopup, showConnectWalletPopup] = useState(false);

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
            <Button onClick={onClickConnectWallet}>Connect Wallet</Button>
          </Grid>
        </Grid>
      </Grid>
      {connectWalletPopup && (
        <ConnectWalletPopup onClose={onCloseConnectWallet} />
      )}
    </>
  );
};

export default Header;
