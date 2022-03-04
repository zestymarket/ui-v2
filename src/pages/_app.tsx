import { AppProps } from 'next/app';
import '@/styles/global.css';
import Layout from '@/components/Layout';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import client from '../lib/graphql';
import { ApolloProvider } from '@apollo/client';

// todo: Font
const theme = createTheme({
  palette: {
    primary: {
      main: `#F89C24`,
    },
    text: {
      primary: `#fff`,
      secondary: `#837C99`,
    },
    background: {
      default: `#181522`,
    },
  },
});

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}
