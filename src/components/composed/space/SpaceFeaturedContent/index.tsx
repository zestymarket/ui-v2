import React from 'react';

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

interface Props {
  onDepositNFT: () => void;
}

const SpaceFeaturedContent: React.FC<Props> = ({ onDepositNFT }) => {
  return (
    <Wrapper>
      <MainSection>
        <Actions
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <DepositNFT />
        </Actions>
        <Title>Back 2 Space</Title>
        <a href="constructarcade.com">constructarcade.com</a>
        <Description>
          Iron || Rails is A WebXR western arcade shooter, where the players try
          to reach the highest position on the leaderboards by shooting the
          attacking enemies.
        </Description>
      </MainSection>
      <InfoSection>
        <Avatar />
        <Content>
          <CreatedInfo>
            Created by <b>0x247...88a</b>
          </CreatedInfo>
          <TimestampInfo>15 September, 2021 18:49 UTC</TimestampInfo>
        </Content>
      </InfoSection>
    </Wrapper>
  );
};

export default SpaceFeaturedContent;
