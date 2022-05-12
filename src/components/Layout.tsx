/* eslint-disable @typescript-eslint/no-empty-function */
import { styled, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';

import { useEagerConnect, useInactiveListener } from '../utils/hooks';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useRouter } from 'next/router';

const noAuthRoutes = new Set([
  `/`,
  `/space/[id]`,
  `/campaigns/[id]`,
  `/auth/discord/[id]`,
  `/[id]`,
]);

interface Props {
  children: React.ReactNode;
}

const StyledContainer = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export const WalletConnectContext = React.createContext<{
  connectWalletPopup: boolean;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  onClickConnectWallet: () => void;
  onCloseConnectWallet: () => void;
}>({
  connectWalletPopup: false,
  address: ``,
  setAddress: () => {},
  onClickConnectWallet: () => {},
  onCloseConnectWallet: () => {},
});

const Layout: React.FC<Props> = ({ children }) => {
  const [noAuthRequired, setNoAuthRequired] = useState<boolean>(false);
  const [web3Loaded, setWeb3Loaded] = useState<boolean>(false);
  const { account } = useWeb3React<Web3Provider>();

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);
  const router = useRouter();

  useEffect(() => {
    if (noAuthRoutes.has(router.pathname)) {
      setNoAuthRequired(true);
    } else {
      setNoAuthRequired(false);
    }
  }, [router.pathname]);

  // Used for displaying wallet not connected message
  useEffect(() => {
    setTimeout(() => {
      setWeb3Loaded(true);
    }, 2000);
  }, []);

  // const [connectWalletPopup, showConnectWalletPopup] = useState<boolean>(false);
  // const [address, setAddress] = useState<string>(``);

  // const onClickConnectWallet = () => {
  //   showConnectWalletPopup(true);
  // };
  // const onCloseConnectWallet = () => showConnectWalletPopup(false);

  return (
    <StyledContainer>
      <Header />
      {typeof account === `string` && children}
      {typeof account !== `string` && noAuthRequired && children}
      {web3Loaded && typeof account !== `string` && !noAuthRequired && (
        // Add loading skeleton
        <div>
          <Typography variant="h1">Wallet Not Found</Typography>
          <br />
          <Typography variant="body1">
            You are not connected to a wallet. Please connect to a wallet.
          </Typography>
        </div>
      )}
      <Footer />
    </StyledContainer>
  );
};

export default Layout;
