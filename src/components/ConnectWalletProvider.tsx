/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export const ConnectWalletContext = React.createContext<{
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

export default function ConnectWalletProvider({ children }: Props) {
  const [connectWalletPopup, showConnectWalletPopup] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(``);

  const onClickConnectWallet = () => {
    showConnectWalletPopup(true);
  };
  const onCloseConnectWallet = () => showConnectWalletPopup(false);

  return (
    <ConnectWalletContext.Provider
      value={{
        connectWalletPopup,
        address,
        setAddress,
        onClickConnectWallet,
        onCloseConnectWallet,
      }}
    >
      {children}
    </ConnectWalletContext.Provider>
  );
}
