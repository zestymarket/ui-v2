import React, { useState, useEffect } from 'react';

import {
  Avatar,
  Content,
  CreatedInfo,
  Description,
  InfoSection,
  MainSection,
  Title,
  Wrapper,
  Actions,
} from './styles';

import CampaignData from '@/utils/classes/CampaignData';
import { shortenHex } from '@/utils/helpers';
import { getENSOrWallet } from '@/utils/hooks';
import makeBlockie from 'ethereum-blockies-base64';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

interface Props {
  campaignData: CampaignData | null;
  isBuyer: boolean;
}

const CampaignFeaturedContent: React.FC<Props> = ({
  campaignData,
  isBuyer,
}) => {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const [address, setAddress] = useState<string>(``);

  useEffect(() => {
    if (campaignData && !address) {
      getENSOrWallet(campaignData.buyer).then((addr: string) => {
        if (addr.endsWith(`.eth`)) setAddress(addr);
        else setAddress(shortenHex(addr, 3));
      });
    }
  }, [campaignData, address]);

  if (!campaignData) {
    return <></>;
  }

  return (
    <Wrapper>
      <MainSection>
        <Actions
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
        ></Actions>
        <Title>{campaignData.name}</Title>
        <a href={campaignData?.url}>{campaignData?.url}</a>
        {campaignData?.format}
        <Description>{campaignData.description}</Description>
      </MainSection>
      <InfoSection>
        <Avatar
          width={44}
          height={44}
          alt="Avatar image of the owner of the space"
          src={makeBlockie(campaignData.buyer)}
        />
        <Content>
          <CreatedInfo>
            Created by <b>{address || shortenHex(campaignData.buyer, 3)}</b>
          </CreatedInfo>
        </Content>
      </InfoSection>
    </Wrapper>
  );
};

export default CampaignFeaturedContent;
