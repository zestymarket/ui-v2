import { NetworkConnector } from '@web3-react/network-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { TorusConnector } from '@web3-react/torus-connector';

import { INFURA_PREFIXES } from './helpers';

export function getNetwork(defaultChainId = 1): NetworkConnector {
  return new NetworkConnector({
    urls: [4, 137].reduce(
      (urls, chainId) =>
        Object.assign(urls, {
          [chainId]: `https://${INFURA_PREFIXES[chainId]}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
        }),
      {},
    ),
    defaultChainId,
  });
}

export const injected = new InjectedConnector({
  supportedChainIds: [4, 137],
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    4: `https://${INFURA_PREFIXES[4]}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
    137: `https://${INFURA_PREFIXES[137]}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
  },
  bridge: `https://bridge.walletconnect.org`,
});

export const walletlink = new WalletLinkConnector({
  url: `https://${INFURA_PREFIXES[137]}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
  appName: `Zesty Market`,
  appLogoUrl: `https://app.zesty.market/android-chrome-512x512.png`,
  supportedChainIds: [4, 137],
});

export const torus = new TorusConnector({
  chainId: 137,
  initOptions: {
    network: {
      host: `matic`,
      chainId: 137,
      networkName: `polygon`,
    },
  },
});
