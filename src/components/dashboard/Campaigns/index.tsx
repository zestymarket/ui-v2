import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getClient } from '@/lib/graphql';
import { styled } from '@mui/material';
import Head from 'next/head';
import LoadingBar from 'react-top-loading-bar';
import { Box, CircularProgress } from '@mui/material';
import { useQuery } from '@apollo/client';

import { GET_CAMPAIGN_BY_BUYER } from '../../../lib/queries';
import { formatIpfsUri } from '../../../utils/helpers';
import { convertOldFormats } from '../../../utils/formats';
import CampaignCard from '@/components/CampaignCard';

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
  display: `grid`,
  gridTemplateColumns: `3fr 3fr 3fr 3fr`,
  alignItems: `flex-start`,
  rowGap: `10px`,
  flexWrap: `wrap`,
  maxWidth: `1400px`,
  margin: `0 auto`,
});

const StyledWrapper = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function MyCampaigns() {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const client = getClient(chainId ?? 0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [buyerCampaigns, setCampaigns] = useState([]);
  const { data, loading, error } = useQuery(GET_CAMPAIGN_BY_BUYER, {
    variables: {
      buyer: account,
      first: 100,
      skip: 0,
    },
    fetchPolicy: `network-only`,
    //onCompleted: hideLoading,
    client,
  });

  useEffect(() => {
    if (loading === false && !error && data) {
      const newCampaigns: any = [];
      Promise.all(
        data.buyerCampaigns.map(async (buyerCampaign: any) => {
          const url = formatIpfsUri(buyerCampaign.uri);
          const uriData = await (await fetch(url)).json();

          const obj = { ...buyerCampaign };
          obj.name = uriData.name;
          obj.description = uriData.description;
          obj.url = uriData.url;
          obj.image = formatIpfsUri(uriData.image);
          obj.format = convertOldFormats(uriData.format);

          newCampaigns.push(obj);
        }),
      )
        .then(() => {
          setCampaigns(newCampaigns);
          console.log(`campaigns`, newCampaigns);
        })
        .catch(
          // when not all buyerCampaigns' data is resolved from IPFS
          () => setCampaigns(newCampaigns),
        );
    }
  }, [data]);
  return (
    <StyledWrapper>
      <LoadingBar progress={loadingMore ? 50 : 100} />
      <Head>
        <title>My Campaigns</title>
      </Head>
      <Header>
        <H1>My Campaigns</H1>
      </Header>
      <Container>
        {!loadingData &&
          buyerCampaigns?.length > 0 &&
          buyerCampaigns.map((campaignData, i) => {
            return <CampaignCard key={i} campaignData={campaignData} />;
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
      </Container>
    </StyledWrapper>
  );
}
