import { InferGetServerSidePropsType } from 'next';
import React, { useState, useEffect, SyntheticEvent } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import SpaceFeaturedContent from '@/components/composed/space/SpaceFeaturedContent';
import SpaceFeaturedMedia from '@/components/composed/space/SpaceFeaturedMedia';
import FeaturedContainer from '@/components/layout/FeaturedContainer';
import SwitchToggle from '@/components/based/SwitchToggle';
import AuctionDataTable from '@/components/based/AuctionDataTable';
import { Button, Grid, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';

import { GET_ONE_ZESTY_NFT } from '@/lib/queries';
import { getClient } from '@/lib/graphql';
import SpaceData from '@/utils/classes/SpaceData';
import { formatIpfsUri, openNewTab } from '@/utils/helpers';
import SpaceHistoricalChart from '@/components/composed/space/SpaceHistoricalChart';

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

export default function SpaceDetailPage({
  id,
  data,
  uri,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { account } = useWeb3React<Web3Provider>();
  const [currentTab, setCurrentTab] = useState(0);
  const [spaceData, setSpaceData] = useState<SpaceData | null>(null);

  const [, setIsCreator] = useState<boolean>(false);

  const [pendingBalance, setPendingBalance] = useState<number>(0);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  const handleDepositNFT = () => {
    return;
  };

  useEffect(() => {
    if (!uri || !data || !id) return;

    const newSpaceData = new SpaceData(data.tokenData, uri);

    // if (newSpaceData.activeAuctions.length > 0) setHasActiveAuctions(true);
    setSpaceData(newSpaceData);
  }, [data, uri, id]);

  useEffect(() => {
    if (!account || !spaceData) return;
    setIsCreator(account?.toUpperCase() === spaceData?.creator.toUpperCase());

    const now = Date.now() / 10 ** 3;

    let pending = 0;
    // const claimable = 0;

    if (spaceData) {
      if (spaceData.auctions.length > 0) {
        spaceData?.auctions.forEach((auction) => {
          const { contract } = auction;
          if (contract?.withdrawn === false) {
            const isClaimable =
              now - Number(auction.sellerAuction.auctionTimeEnd) > 0;
            if (isClaimable === true) {
              // claimable += Number(contract.contractValue);
              // idsToWithdraw.push(contract.id);
            } else pending += Number(contract.contractValue);
          }
        });
      }
    }

    setPendingBalance(pending / 10 ** 6);
    // setClaimableBalance(claimable / 10 ** 6);
  }, [spaceData, account]);

  return (
    <Container>
      <HeadingSection>
        <FeaturedContainer
          content={
            <SpaceFeaturedContent
              onDepositNFT={handleDepositNFT}
              spaceData={spaceData}
            />
          }
          media={<SpaceFeaturedMedia src={spaceData?.image} />}
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
            <PageTab label="Auctions" />
            <PageTab label="History" />
            <PageTab label="Analytics" />
            <PageTab label="About" />
          </PageTabs>
          <BuyButton
            onClick={() => {
              openNewTab(
                `https://docs.zesty.market/guides/for-advertisers/bid`,
              );
            }}
          >
            How do I buy?
          </BuyButton>
        </TabsWrapper>
      </HeadingSection>
      <ContentSection>
        {currentTab === 0 && (
          <SectionInner>
            <ConfigPanel>
              {/* <OptionButtonGroup
              options={[
                { value: 1, label: `THE FRONTPAGE 34` },
                { value: 2, label: `LEFT SIDEBAR 24` },
                { value: 3, label: `BOTTOM BAR 0`, disabled: true },
              ]}
              allLabel="ALL 123"
              allOption
              multiple
            /> */}
              <SwitchToggle label="Only available" />
            </ConfigPanel>
            <AuctionDataTable auctions={spaceData?.activeAuctions || []} />
          </SectionInner>
        )}
        {currentTab === 1 && (
          <SectionInner>
            <SpaceHistoricalChart id={id} />
            <Grid container pt={4} justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md={6}>
                <AssetContainer flexDirection="column" justifyContent="center">
                  <AssetContainerLabelText>
                    Total Revenue
                  </AssetContainerLabelText>
                  <AssetContainerAssetText>
                    ${(Number(spaceData?.volume || 0.0) / 10 ** 6).toFixed(2)}
                  </AssetContainerAssetText>
                </AssetContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <AssetContainer flexDirection="column" justifyContent="center">
                  <AssetContainerLabelText>Pending</AssetContainerLabelText>
                  <AssetContainerAssetText>
                    ${pendingBalance.toFixed(2)}
                  </AssetContainerAssetText>
                </AssetContainer>
              </Grid>
              <Grid item xs={12} pt={6}>
                <HistoricalHeader>Past Auctions</HistoricalHeader>
                <AuctionDataTable auctions={spaceData?.auctions || []} />
              </Grid>
            </Grid>
          </SectionInner>
        )}
        {currentTab === 2 && <SectionInner></SectionInner>}
        {currentTab === 3 && <SectionInner></SectionInner>}
      </ContentSection>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const { id, chainId } = context.query;
  const client = getClient(chainId !== null ? parseInt(chainId) : 137);
  const { data } = await client.query({
    query: GET_ONE_ZESTY_NFT,
    variables: {
      id,
    },
    fetchPolicy: `network-only`,
  });

  if (!data.tokenData) {
    return {
      props: { id, data },
    };
  }

  const url = formatIpfsUri(data.tokenData.uri);
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
      metadata,
    },
  };
}
