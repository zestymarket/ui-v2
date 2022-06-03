import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_ZESTY_NFT_BY_CREATOR } from '@/lib/queries';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getClient } from '@/lib/graphql';
import { formatIpfsUri } from '@/utils/helpers';
import SpaceData from '@/utils/classes/SpaceData';
import { styled } from '@mui/material';
import SpaceCard from '@/components/SpaceCard';
import Button from '@/components/Button';
import Head from 'next/head';
import throttle from 'lodash.throttle';
import LoadingBar from 'react-top-loading-bar';
import { Box, CircularProgress } from '@mui/material';
let lastScrollTop = 0;
const PAGE_LIMIT = 20;
let timeout = -1;

const Header = styled(`header`)({
  display: `flex`,
  justifyContent: `space-between`,
  alignItems: `center`,
  maxWidth: `1400px`,
  margin: `0 auto`,
});

const H1 = styled(`h1`)({
  fontWeight: 700,
  fontSize: `26px`,
  letterSpace: -0.02,
});

const Container = styled(`div`)({
  display: `flex`,
  justifyContent: `space-between`,
  rowGap: `40px`,
  flexWrap: `wrap`,
  maxWidth: `1400px`,
  margin: `0 auto`,
});

const StyledWrapper = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function MySpaces() {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const client = getClient(chainId ?? 0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [spacesData, setSpacesData] = useState([] as SpaceData[]);
  const { data, loading, error } = useQuery(GET_ZESTY_NFT_BY_CREATOR, {
    variables: {
      creator: account,
      first: PAGE_LIMIT,
      skip,
    },
    fetchPolicy: `network-only`,
    client: client,
    onError: () => setLoadingMore(false),
  });
  useEffect(() => {
    const throttledHandler = throttle(
      async () => {
        if (
          window.pageYOffset + window.innerHeight >=
          document.documentElement.scrollHeight - 10
        ) {
          const scrollTop = document.documentElement.scrollTop;
          if (lastScrollTop && scrollTop < lastScrollTop) return;
          lastScrollTop = scrollTop;
          if (loadingMore) return;
          setSkip(skip + PAGE_LIMIT);
          setLoadingMore(true);
          timeout = window.setTimeout(() => setLoadingMore(false), 5000);
        }
      },
      500,
      { leading: true },
    );
    window.addEventListener(`scroll`, throttledHandler);
    return () => window.removeEventListener(`scroll`, throttledHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.clearTimeout(timeout);
    if (loading == false && !error && data) {
      const _spacesData: SpaceData[] = spacesData.slice();
      const array = data?.tokenDatas ?? [];
      if (!array.length) setLoadingMore(false);
      Promise.all(
        array.map(async (tokenData: any) => {
          const url = formatIpfsUri(tokenData.uri);
          const uri = await (await fetch(url)).json();
          _spacesData.push(new SpaceData(tokenData, uri));
        }),
      ).then(() => {
        setSpacesData(_spacesData);
        setLoadingMore(false);
        setLoadingData(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, error]);

  if (error) console.error(error);
  return (
    <StyledWrapper>
      <LoadingBar progress={loadingMore ? 50 : 100} />
      <Head>
        <title>My Spaces</title>
      </Head>
      <Header>
        <H1>My Spaces</H1>
        <Button variant="contained" color="primary" onClick={() => null}>
          Create Space
        </Button>
      </Header>
      <Container>
        {!loadingData &&
          spacesData?.length > 0 &&
          spacesData.map((spaceData, i) => {
            return <SpaceCard key={i} spaceData={spaceData} />;
          })}
        {loadingData && (
          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            marginTop="50px"
            paddingBottom="100px"
          >
            <CircularProgress />
          </Box>
        )}
        {!loadingData && spacesData?.length === 0 && (
          <div>No Spaces Created</div>
        )}
      </Container>
    </StyledWrapper>
  );
}
