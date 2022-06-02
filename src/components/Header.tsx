import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { styled, Grid } from '@mui/material';
import Logo from './Logo';
import HeaderTab from './HeaderTab';
import Button from './Button';
import ConnectWalletPopup from './ConnectWalletPopup';
import { shortenHex } from '@/utils/helpers';
import { ConnectWalletContext } from './ConnectWalletProvider';

interface HeaderProps {
  pageTitle: string;
}

const StyledButton = styled(Button)({
  background: `linear-gradient(112.17deg, rgba(248, 151, 36, 0.16) 0%, rgba(226, 63, 38, 0.16) 100%)`,
});

const StyledHeader = styled(`div`)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 60,
  fontWeight: 600,
  marginLeft: theme.spacing(),
  marginBottom: theme.spacing(),
  marginRight: theme.spacing(2),
  alignItems: `center`,
}));

const StyledBackArrow = styled(`div`)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(),
  fontSize: 25,
  marginRight: theme.spacing(2),
  cursor: `pointer`,
  '&:hover': {
    color: theme.palette.primary.dark,
  },
}));

const Header = ({ pageTitle }: HeaderProps) => {
  const {
    connectWalletPopup,
    address,
    setAddress,
    onClickConnectWallet,
    onCloseConnectWallet,
  } = useContext(ConnectWalletContext);

  const router = useRouter();

  return (
    <>
      <Grid container sx={{ py: 3, backgroundColor: `#181522` }}>
        <Grid
          container
          direction="column"
          sx={{ maxWidth: 1400, margin: `auto` }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={2}
          >
            <Grid container>
              <Grid
                container
                item
                xs={5}
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Logo />
                <HeaderTab label="Marketplace" to="/" />
                <HeaderTab label="Dashboard" to="/dashboard" />
                <HeaderTab label="Governance" to="/governance" />
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
                    {address.endsWith(`.eth`)
                      ? address
                      : shortenHex(address, 4)}
                  </StyledButton>
                )}
              </Grid>
            </Grid>
          </Grid>
          {pageTitle && (
            <Grid container direction="column" py={1} pt={4}>
              <StyledBackArrow onClick={() => router.back()}>←</StyledBackArrow>
              <StyledHeader>{pageTitle}</StyledHeader>
            </Grid>
          )}
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
