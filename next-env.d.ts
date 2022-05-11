/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
interface Window {
  // walletLinkExtension is injected by the Coinbase Wallet extension
  walletLinkExtension?: any;
  ethereum?: {
    // value that is populated and returns true by the Coinbase Wallet mobile dapp browser
    isCoinbaseWallet?: true;
    isMetaMask?: true;
    autoRefreshOnNetworkChange?: boolean;
  };
  web3?: Record<string, unknown>;
}
