import { InferGetServerSidePropsType } from 'next';
import React, { useState, useEffect, SyntheticEvent } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import CampaignTableData from '@/components/composed/campaign/CampaignTable';
import { Button, Grid, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import FeaturedContainer from '@/components/layout/FeaturedContainer';
import SpaceFeaturedMedia from '@/components/composed/space/SpaceFeaturedMedia';
import CampaignFeaturedContent from '@/components/composed/campaign/CampaignFeaturedContent';
import { GET_ONE_CAMPAIGN, GET_AUCTION_BY_CAMPAIGN } from '@/lib/queries';
import { getClient } from '@/lib/graphql';
import { formatIpfsUri } from '@/utils/helpers';
import { PageContext } from '@/lib/context/page';
import CampaignData from '../../utils/classes/CampaignData';
import { getENSOrWallet } from '../../utils/hooks';
export const Container = styled(`div`)({
  display: `flex`,
  flexDirection: `column`,
  width: `100%`,
});

export const HeadingSection = styled(`section`)({
  background: `#181522`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
});

export const TabsWrapper = styled(`div`)({
  width: `100%`,
  maxWidth: 1220,
  display: `flex`,
  marginTop: 66,
});

export const BuyButton = styled(Button)({
  fontFamily: `Inter`,
  textTransform: `none`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 18,
  color: `#bdb9c8`,
  padding: `16px 16px`,
  lineHeight: 0,
  borderRadius: `0 !important`,
  opacity: 0.5,
  transition: `all 0.3s`,

  '&:hover': {
    opacity: 1,
  },
});

export const PageTabs = styled(Tabs)({
  width: `420px`,

  '.MuiTabs-indicator': {
    background: `#f89c24`,
  },
});

export const PageTab = styled(Tab)({
  fontFamily: `Inter`,
  textTransform: `none`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: `18px`,
  color: `#bdb9c8`,
  opacity: 1,
  padding: `16px 0`,
  lineHeight: 0,

  '.Mui-selected': {
    color: `#f89c24`,
  },
});

export const ContentSection = styled(`section`)({
  background: `#211d35`,
  minHeight: 500,
  display: `flex`,
  justifyContent: `center`,
});

export const SectionInner = styled(`div`)({
  padding: `40px 0`,
  width: 1220,
});

export const ConfigPanel = styled(`div`)({
  display: `flex`,
  alignItems: `flex-end`,
  flexDirection: `column`,
  justifyContent: `space-between`,
  marginBottom: 30,
});

export const AssetContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: 156,
  textAlign: `center`,
  borderRadius: 8,
  display: `flex`,
}));

export const AssetContainerLabelText = styled(`div`)(({ theme }) => ({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  fontSize: 18,
  color: theme.palette.secondary.contrastText,
}));

export const AssetContainerAssetText = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 700,
  fontSize: 48,
});

export const HistoricalHeader = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 700,
  fontSize: 26,
  lineHeight: `60px`,
});

export default function CampaignDetailPage({
  id,
  data,
  uri,
  auctionData,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { setPageName } = React.useContext(PageContext);
  setPageName(``);
  const { account } = useWeb3React<Web3Provider>();
  const [currentTab, setCurrentTab] = useState(0);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [address, setAddress] = useState(``);
  const [isBuyer, setIsBuyer] = useState(false);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  useEffect(() => {
    if (!uri || !data || !auctionData) return;
    const newCampaignData = new CampaignData(
      data,
      uri,
      auctionData?.buyerCampaign.sellerAuctions,
    );
    setCampaignData(newCampaignData);

    if (!address.length && newCampaignData.buyer) {
      getENSOrWallet(newCampaignData.buyer).then((addr: any) => {
        setAddress(addr);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, uri, auctionData]);

  useEffect(() => {
    setIsBuyer(account?.toUpperCase() === campaignData?.buyer.toUpperCase());
  }, [account, campaignData]);

  return (
    <Container>
      <HeadingSection>
        <FeaturedContainer
          content={
            <CampaignFeaturedContent
              campaignData={campaignData}
              isBuyer={isBuyer}
            />
          }
          media={<SpaceFeaturedMedia src={campaignData?.image} />}
        />
        <TabsWrapper>
          <PageTabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="detail-tabs"
          >
            <PageTab label="Bids" />
          </PageTabs>
        </TabsWrapper>
      </HeadingSection>
      <ContentSection>
        {currentTab === 0 && (
          <SectionInner>
            <CampaignTableData
              campaignAuctions={campaignData?.auctions || []}
            />
          </SectionInner>
        )}
      </ContentSection>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const { id, chainId } = context.query;
  const client = getClient(chainId !== null ? parseInt(chainId) : 137);
  const { data } = await client.query({
    query: GET_ONE_CAMPAIGN,
    variables: {
      id,
    },
    fetchPolicy: `network-only`,
  });

  const auctionData = (
    await client.query({
      query: GET_AUCTION_BY_CAMPAIGN,
      variables: {
        id,
        first: 27,
      },
      fetchPolicy: `network-only`,
    })
  ).data;

  if (!data.buyerCampaign) {
    return {
      props: { id, data },
    };
  }

  const url = formatIpfsUri(data.buyerCampaign.uri);
  const uri = await (await fetch(url)).json();

  const metadata = {
    name: uri.name,
    description: uri.description,
    image: formatIpfsUri(uri.image),
  };

  return {
    props: {
      id,
      data,
      uri,
      auctionData,
      metadata,
    },
  };
}
