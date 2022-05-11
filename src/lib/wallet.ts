import {
  injected,
  walletconnect,
  walletlink,
  torus,
} from '../utils/connectors';

interface WalletInfo {
  connector: any;
  name: string;
  mobile?: boolean;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: `Injected web3 provider`,
  },
  METAMASK: {
    connector: injected,
    name: `MetaMask`,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: `Coinbase Wallet`,
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: `Wallet Connect`,
    mobile: true,
  },
  TORUS: {
    connector: torus,
    name: `Torus`,
  },
};

export const EXPLORER_URLS: { [key: number]: string } = {
  4: `https://rinkeby.etherscan.io/`,
  137: `https://polygonscan.com/`,
};
