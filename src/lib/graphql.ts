import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

export const rinkebyClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_THE_GRAPH_URI_RINKEBY,
  cache: new InMemoryCache(),
});

export const maticClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_THE_GRAPH_URI_MATIC,
  cache: new InMemoryCache(),
});

export const mainnetClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_THE_GRAPH_URI_MAINNET,
  cache: new InMemoryCache(),
});

export default maticClient;

export const getClient = (
  chainId: number,
): ApolloClient<NormalizedCacheObject> => {
  if (typeof chainId !== `number` && chainId !== null && !isNaN(chainId))
    throw new TypeError(`chainId received is not a number or null`);

  switch (chainId) {
    case 4:
      return rinkebyClient;

    case 137:
      return maticClient;

    default:
      return maticClient;
  }
};
