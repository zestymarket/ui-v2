import React, { useState, useEffect } from 'react';

import {
  Avatar,
  Content,
  CreatedInfo,
  Description,
  InfoSection,
  MainSection,
  TimestampInfo,
  Title,
  Wrapper,
  Actions,
} from './styles';
import DepositNFT from '@/components/DepositNFT';

import SpaceData from '@/utils/classes/SpaceData';
import { getDomain, shortenHex } from '@/utils/helpers';
import { getENSOrWallet } from '@/utils/hooks';
import moment from 'moment';
import makeBlockie from 'ethereum-blockies-base64';
import Button from '@/components/Button';

import { useZestyMarketUSDC } from '@/utils/hooks';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { useRouter } from 'next/router';

const DATEFORMAT = `Do MMMM[,] YYYY hh:mm [UTC]`;

interface Props {
  spaceData: SpaceData | null;
  onDepositNFT: () => void;
  isCreator: boolean;
  hasActiveAuctions: boolean;
}

const SpaceFeaturedContent: React.FC<Props> = ({
  spaceData,
  isCreator,
  hasActiveAuctions,
}) => {
  const { account } = useWeb3React<Web3Provider>();
  const [address, setAddress] = useState<string>(``);
  const [creationDate, setCreationDate] = useState<string>(``);
  const [inProgressCount, setInProgressCount] = useState<number>(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const zestyMarketUSDC = account ? useZestyMarketUSDC(true) : undefined;
  const router = useRouter();

  useEffect(() => {
    if (spaceData && !address) {
      getENSOrWallet(spaceData.creator).then((addr: string) => {
        if (addr.endsWith(`.eth`)) setAddress(addr);
        else setAddress(shortenHex(addr, 3));
      });
      setCreationDate(moment.unix(spaceData.timeCreated).format(DATEFORMAT));
    }
  }, [spaceData, address]);

  useEffect(() => {
    if (zestyMarketUSDC && spaceData) {
      zestyMarketUSDC
        .getSellerNFTSetting(spaceData.id)
        .then((res: any) => {
          setInProgressCount(res.inProgressCount.toNumber());
        })
        .catch((err: Error) => {
          console.log(err);
        });
    }
  }, [spaceData, zestyMarketUSDC]);

  if (!spaceData) {
    return <></>;
  }

  return (
    <Wrapper>
      <MainSection>
        <Actions
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {isCreator &&
            !spaceData.burned &&
            !(hasActiveAuctions || inProgressCount > 0) && <DepositNFT />}
          {isCreator && !spaceData.withdrawn && (
            <Button
              onClick={() => {
                router.push(`/space/${spaceData.id}/new-auction`);
              }}
            >
              Create Auction
            </Button>
          )}
        </Actions>
        <Title>{spaceData.name}</Title>
        <a href={spaceData.location}>{getDomain(spaceData.location)}</a>
        <Description>{spaceData.description}</Description>
      </MainSection>
      <InfoSection>
        <Avatar
          width={44}
          height={44}
          alt="Avatar image of the owner of the space"
          src={makeBlockie(spaceData.creator)}
        />
        <Content>
          <CreatedInfo>
            Created by <b>{address || shortenHex(spaceData.creator, 3)}</b>
          </CreatedInfo>
          <TimestampInfo>{creationDate}</TimestampInfo>
          {/* <TimestampInfo>15 September, 2021 18:49 UTC</TimestampInfo> */}
        </Content>
      </InfoSection>
    </Wrapper>
  );
};

export default SpaceFeaturedContent;
