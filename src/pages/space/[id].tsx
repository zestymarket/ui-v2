import { InferGetServerSidePropsType } from 'next';
import React, { useState, useEffect, SyntheticEvent } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import SpaceFeaturedContent from '@/components/composed/space/SpaceFeaturedContent';
import SpaceFeaturedMedia from '@/components/composed/space/SpaceFeaturedMedia';
import FeaturedContainer from '@/components/layout/FeaturedContainer';
import OptionButtonGroup from '@/components/based/OptionButtonGroup';
import SwitchToggle from '@/components/based/SwitchToggle';
import AuctionDataTable from '@/components/based/AuctionDataTable';
import { Button, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import { useEagerConnect, useInactiveListener } from '@/utils/hooks';

import { GET_ONE_ZESTY_NFT } from '@/lib/queries';
import { getClient } from '@/lib/graphql';
import SpaceData from '@/utils/classes/SpaceData';
import { shortenHex, removeHttps, formatIpfsUri } from '@/utils/helpers';

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
  alignItems: `center`,
  justifyContent: `space-between`,
  marginBottom: 30,
});

export default function SpaceDetailPage({
  id,
  data,
  uri,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const [value, setValue] = useState(0);
  const [spaceData, setSpaceData] = useState<SpaceData | null>(null);

  const [isCreator, setIsCreator] = useState<boolean>(false);

  const [pendingBalance, setPendingBalance] = useState<number>(0);
  const [claimableBalance, setClaimableBalance] = useState<number>(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleDepositNFT = () => {
    return;
  };

  useEffect(() => {
    if (!uri || !data) return;

    const newSpaceData = new SpaceData(data.tokenData, uri);

    // if (newSpaceData.activeAuctions.length > 0) setHasActiveAuctions(true);
    setSpaceData(newSpaceData);
  }, [data, uri]);

  useEffect(() => {
    if (!account || !spaceData) return;
    setIsCreator(account?.toUpperCase() === spaceData?.creator.toUpperCase());

    const now = Date.now() / 10 ** 3;

    let pending = 0;
    let claimable = 0;

    if (spaceData) {
      if (spaceData.auctions.length > 0) {
        spaceData?.auctions.forEach((auction) => {
          const { contract } = auction;
          if (contract?.withdrawn === false) {
            const isClaimable = now - Number(auction.auctionTimeEnd) > 0;
            if (isClaimable === true) {
              claimable += Number(contract.contractValue);
              // idsToWithdraw.push(contract.id);
            } else pending += Number(contract.contractValue);
          }
        });
      }
    }

    setPendingBalance(pending / 10 ** 6);
    setClaimableBalance(claimable / 10 ** 6);
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
            value={value}
            onChange={handleChange}
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
          <BuyButton>How do I buy?</BuyButton>
        </TabsWrapper>
      </HeadingSection>
      <ContentSection>
        <SectionInner>
          <ConfigPanel>
            <OptionButtonGroup
              options={[
                { value: 1, label: `THE FRONTPAGE 34` },
                { value: 2, label: `LEFT SIDEBAR 24` },
                { value: 3, label: `BOTTOM BAR 0`, disabled: true },
              ]}
              allLabel="ALL 123"
              allOption
              multiple
            />
            <SwitchToggle label="Only available" />
          </ConfigPanel>
          <AuctionDataTable
            auctions={spaceData?.activeAuctions || []}
            format={`test`}
          />
        </SectionInner>
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
