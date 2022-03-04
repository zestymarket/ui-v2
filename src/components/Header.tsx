import React from 'react';
import Grid from '@mui/material/Grid';
import Logo from './Logo';
import HeaderTab from './HeaderTab';
import Button from './Button';

const Header = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
      sx={{ py: 3 }}
    >
      <Grid
        container
        item
        xs={6}
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Logo />
        <HeaderTab label="Marketplace" selected />
        <HeaderTab label="Dashboard" />
      </Grid>

      <Grid container item xs={6} justifyContent="center">
        <Button outlined onClick={() => null}>
          Buy USDC
        </Button>
        <Button outlined onClick={() => null}>
          Network
        </Button>
        <Button onClick={() => null}>Connect Wallet</Button>
      </Grid>
    </Grid>
  );
};

export default Header;
