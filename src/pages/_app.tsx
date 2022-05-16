import { AppProps } from 'next/app';
import '@/styles/global.css';
import { theme } from '@/styles/theme';
import Layout from '@/components/Layout';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import client from '../lib/graphql';
import { ApolloProvider } from '@apollo/client';
import ConnectWalletProvider from '@/components/ConnectWalletProvider';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <ConnectWalletProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </ConnectWalletProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}
