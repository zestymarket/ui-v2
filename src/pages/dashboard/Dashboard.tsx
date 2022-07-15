import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';

import TabsContainer from '@/components/TabsContainer';
import Overview from '@/components/dashboard/FundCards';
import Account from '@/components/dashboard/Account';
import MySpaces from '@/components/dashboard/MySpaces';
import Notification from '@/components/dashboard/Notification/index';
import MyCampaigns from '@/components/dashboard/Campaigns/index';
import StyledDashboard from './styled';
import { Web3Provider } from '@ethersproject/providers';
// import { useZestyMarketUSDC } from '@/utils/hooks';
import { getClient } from '@/lib/graphql';
import { GET_USER_DATA, GET_ZESTY_NFT_BY_CREATOR } from '@/lib/queries';
import SpaceData from '@/utils/classes/SpaceData';
import { formatIpfsUri } from '@/utils/helpers';

export default function Dashboard() {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const client = chainId ? getClient(chainId) : undefined;
  // const zestyMarketUSDC = account ? useZestyMarketUSDC(true) : undefined;

  const [totalReceived, setTotalReceived] = useState(0);
  const [totalSent, setTotalSent] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalClaimable, setTotalClaimable] = useState(0);
  const [idsToWithdraw, setIdsToWithdraw] = useState<number[]>([]);

  function onTotalsCalculated(
    pending: number,
    claimable: number,
    ids: number[],
  ) {
    setTotalPending(pending / 10 ** 6);
    setTotalClaimable(claimable / 10 ** 6);
    setIdsToWithdraw(ids);
  }

  const {
    data: userData,
    loading: userDataLoading,
    error: userDataError,
  } = useQuery(GET_USER_DATA, {
    variables: {
      id: account,
    },
    fetchPolicy: `network-only`,
    onCompleted: () => {
      // loading
    },
    client: client,
  });

  useEffect(() => {
    if (userDataLoading == false && !userDataError && userData) {
      const user = userData.user;

      const received = user?.USDCReceived ?? 0;
      const sent = user?.USDCSent ?? 0;

      setTotalReceived(received / 10 ** 6);
      setTotalSent(sent / 10 ** 6);
    }
  }, [userData, userDataLoading, userDataError]);

  const {
    data: nftData,
    loading: nftDataLoading,
    error: nftDataError,
  } = useQuery(GET_ZESTY_NFT_BY_CREATOR, {
    variables: {
      creator: account,
      first: 1000,
      skip: 0,
    },
    fetchPolicy: `network-only`,
    client: client,
  });

  useEffect(() => {
    if (nftDataLoading == false && !nftDataError && nftData) {
      const newSpaceDatas = [];

      let totalPending = 0;
      let totalClaimable = 0;

      const idsToWithdraw: number[] = [];

      Promise.all(
        nftData.tokenDatas.map(async (tokenData: any) => {
          const url = formatIpfsUri(tokenData.uri);

          try {
            const uri = await (await fetch(url)).json();
            const spaceData = new SpaceData(tokenData, uri);

            const now = Date.now() / 10 ** 3;

            let pending = 0;
            let claimable = 0;

            spaceData.auctions.forEach((auction: any) => {
              const contract = auction.contract;
              if (contract?.withdrawn === false) {
                const isClaimable = now - Number(auction.auctionTimeEnd) > 0;
                if (isClaimable === true) {
                  claimable += Number(contract.contractValue);
                  idsToWithdraw.push(contract.id);
                } else pending += Number(contract.contractValue);
              }
            });

            totalClaimable += claimable;
            totalPending += pending;

            newSpaceDatas.push(spaceData);
          } catch {}
        }),
      ).then(() => {
        onTotalsCalculated(totalPending, totalClaimable, idsToWithdraw);
      });
    }
  }, [nftData, nftDataLoading, nftDataError]);

  return (
    <StyledDashboard>
      <TabsContainer
        title="Dashboard"
        tabs={[
          {
            id: `my-spaces`,
            label: `My Spaces`,
            PanelComponent: MySpaces,
            panelProps: {
              totalReceived,
              totalSent,
              totalPending,
              totalClaimable,
            },
          },
          {
            id: `my-campaigns`,
            label: `My Campaigns`,
            PanelComponent: MyCampaigns,
          },
          {
            id: `notifications`,
            label: `Notifications`,
            PanelComponent: Notification,
          },
          {
            id: `account-management`,
            label: `Account Management`,
            PanelComponent: Account,
          },
        ]}
      />
    </StyledDashboard>
  );
}
