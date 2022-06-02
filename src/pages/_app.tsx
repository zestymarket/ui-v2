import { AppProps } from 'next/app';
import '@/styles/global.css';
import { theme } from '@/styles/theme';
import Layout from '@/components/Layout';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import client from '../lib/graphql';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import ConnectWalletProvider from '@/components/ConnectWalletProvider';
import { PageProvider } from '../lib/context/page';
import { store, persistor } from '../lib/redux/rootReducer';
import { PersistGate } from 'redux-persist/integration/react';
import { SnackbarProvider } from 'notistack';
import {
  SNACKBAR_CLASSES,
  SNACKBAR_DEFAULT_ANCHOR_ORIGIN,
} from '@/lib/snackbar';

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
            <SnackbarProvider
              classes={SNACKBAR_CLASSES}
              anchorOrigin={SNACKBAR_DEFAULT_ANCHOR_ORIGIN}
            >
              <ReduxProvider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <PageProvider>
                    <CssBaseline />
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </PageProvider>
                </PersistGate>
              </ReduxProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </ConnectWalletProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}
