import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_ZESTY_NFT_BY_CREATOR } from '@/lib/queries';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getClient } from '@/lib/graphql';
import { formatIpfsUri } from '@/utils/helpers';
import SpaceData from '@/utils/SpaceData';
import { styled } from '@mui/material';
import SpaceCard from '@/components/SpaceCard';
import Button from '@/components/Button';
import Head from 'next/head';

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
  const [spacesData, setSpacesData] = useState([] as SpaceData[]);
  const { data, loading, error } = useQuery(GET_ZESTY_NFT_BY_CREATOR, {
    variables: {
      creator: account,
      first: 20,
      skip: 0,
    },
    fetchPolicy: `network-only`,
    client: client,
  });
  useEffect(() => {
    if (loading == false && !error && data) {
      const _spacesData: SpaceData[] = [];
      Promise.all(
        data.tokenDatas.map(async (tokenData: any) => {
          const url = formatIpfsUri(tokenData.uri);
          const uri = await (await fetch(url)).json();
          _spacesData.push(new SpaceData(tokenData, uri));
        }),
      ).then(() => setSpacesData(_spacesData));
    }
  }, [data, loading, error]);

  if (error) console.error(error);
  return (
    <StyledWrapper>
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
        {!loading &&
          spacesData?.length > 0 &&
          Array(100)
            .fill(spacesData[0])
            .map((spaceData, i) => {
              return <SpaceCard key={i} spaceData={spaceData} />;
            })}
        {!loading && spacesData?.length === 0 && <div>No Spaces Created</div>}
      </Container>
    </StyledWrapper>
  );
}
