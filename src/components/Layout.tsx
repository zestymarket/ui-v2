/* eslint-disable @typescript-eslint/no-empty-function */
import { styled } from '@mui/system';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Footer from './Footer';
import Header from './Header';

import { useEagerConnect, useInactiveListener } from '../utils/hooks';

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
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const [connectWalletPopup, showConnectWalletPopup] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(``);

  const onClickConnectWallet = () => {
    showConnectWalletPopup(true);
  };
  const onCloseConnectWallet = () => showConnectWalletPopup(false);

  return (
    <WalletConnectContext.Provider
      value={{
        connectWalletPopup,
        address,
        setAddress,
        onClickConnectWallet,
        onCloseConnectWallet,
      }}
    >
      <StyledContainer>
        <Header />
        {children}
        <Footer />
      </StyledContainer>
    </WalletConnectContext.Provider>
  );
};

export default Layout;
