import React, { useEffect, useState } from 'react';
import SubHeader from '@/components/SubHeader';
import Button from '@/components/Button';
import router from 'next/router';
import { GET_ONE_ZESTY_NFT } from '@/lib/queries';
import { formatIpfsUri } from '@/utils/helpers';
import { getClient } from '@/lib/graphql';
import { useQuery } from '@apollo/client';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import SpaceData from '@/utils/classes/SpaceData';
import AuctionCalendar from '@/components/new-auction/AuctionCalendar';

const NewAuction = () => {
  const { id } = router.query;
  const { account, chainId } = useWeb3React<Web3Provider>();
  const client = getClient(chainId !== null ? chainId || 137 : 137);
  const { data } = useQuery(GET_ONE_ZESTY_NFT, {
    variables: {
      id,
    },
    client,
    fetchPolicy: `network-only`,
  });

  const [spaceTitle, setSpaceTitle] = useState<string>(`...`);
  const [spaceData, setSpaceData] = useState<SpaceData | null>(null);
  const [filteredAuctions, setFilteredAuctions] = useState<any>([]);

  useEffect(() => {
    if (data?.tokenData) {
      console.log(`data`, data);
      const url = formatIpfsUri(data.tokenData.uri);
      fetch(url)
        .then((uri) => {
          return uri.json();
        })
        .then((formattedData) => {
          const newSpaceData = new SpaceData(data.tokenData, formattedData);

          setSpaceData(newSpaceData);
          setSpaceTitle(formattedData.name);
          setFilteredAuctions(
            newSpaceData.auctions?.map((auction) => {
              if (auction.sellerAuction.cancelled === false)
                return auction.sellerAuction;
            }),
          );
        });
    }
  }, [data]);

  return (
    <>
      <SubHeader label="New Auction" sublabel={`for ${spaceTitle}`} />
      <AuctionCalendar
        id={id}
        filteredAuctions={filteredAuctions}
      ></AuctionCalendar>
    </>
  );
};

export default NewAuction;
