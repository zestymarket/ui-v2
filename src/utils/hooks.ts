import { useEffect, useState } from 'react';
import { Web3Provider, getDefaultProvider } from '@ethersproject/providers';
import { injected } from './connectors';
import { useWeb3React } from '@web3-react/core';

export async function getENSOrWallet(account: string) {
  const provider = getDefaultProvider(`mainnet`, {
    infura: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  });
  return (await provider.lookupAddress(account)) || account;
}

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate, deactivate } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log(`Handling 'connect' event`);
        activate(injected);
      };
      const handleDisconnect = () => {
        console.log(`Handling 'disconnect' event`);
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log(`Handling 'chainChanged' event with payload`, chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log(`Handling 'accountsChanged' event with payload`, accounts);
        if (accounts.length > 0) {
          activate(injected);
        } else {
          deactivate();
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log(`Handling 'networkChanged' event with payload`, networkId);
        activate(injected);
      };

      ethereum.on(`connect`, handleConnect);
      ethereum.on(`disconnect`, handleDisconnect);
      ethereum.on(`chainChanged`, handleChainChanged);
      ethereum.on(`accountsChanged`, handleAccountsChanged);
      ethereum.on(`networkChanged`, handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener(`connect`, handleConnect);
          ethereum.removeListener(`disconnect`, handleDisconnect);
          ethereum.removeListener(`chainChanged`, handleChainChanged);
          ethereum.removeListener(`accountsChanged`, handleAccountsChanged);
          ethereum.removeListener(`networkChanged`, handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate, deactivate]);
}

export function addRPC(library: any, network = `polygon`) {
  let call: any;
  if (network === `polygon`) {
    call = {
      jsonrpc: `2.0`,
      method: `wallet_addEthereumChain`,
      params: [
        {
          chainId: `0x89`,
          chainName: `Polygon Mainnet`,
          rpcUrls: [`https://polygon-rpc.com`],
          nativeCurrency: {
            name: `MATIC`,
            symbol: `MATIC`,
            decimals: 18,
          },
          blockExplorerUrls: [`https://polygonscan.com`],
        },
      ],
      id: 0,
    };
  } else if (network === `rinkeby`) {
    call = {
      jsonrpc: `2.0`,
      method: `wallet_switchEthereumChain`,
      params: [{ chainId: `0x4` }],
      id: 0,
    };
  } else {
    call = {
      jsonrpc: `2.0`,
      method: `wallet_addEthereumChain`,
      params: [
        {
          chainId: `0x89`,
          chainName: `Polygon Mainnet`,
          rpcUrls: [`https://polygon-rpc.com`],
          nativeCurrency: {
            name: `MATIC`,
            symbol: `MATIC`,
            decimals: 18,
          },
          blockExplorerUrls: [`https://polygonscan.com`],
        },
      ],
      id: 0,
    };
  }

  if (!!library) {
    library.provider.request(call);
  } else {
    if ((window as any).ethereum) {
      const web3 = new Web3Provider((window as any).ethereum);
      try {
        (window as any).ethereum.enable().then(function () {
          (web3.provider as any).request(call);
        });
      } catch (e) {
        console.error(e);
      }
    }
    // Non-DApp Browsers
    else {
      alert(`You have to install MetaMask !`);
    }
  }
}
