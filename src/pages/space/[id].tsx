import React, { SyntheticEvent } from 'react';
import SpaceFeaturedContent from '@/components/composed/space/SpaceFeaturedContent';
import SpaceFeaturedMedia from '@/components/composed/space/SpaceFeaturedMedia';
import FeaturedContainer from '@/components/layout/FeaturedContainer';
import OptionButtonGroup from '@/components/based/OptionButtonGroup';
import SwitchToggle from '@/components/based/SwitchToggle';
import AuctionDataTable from '@/components/based/AuctionDataTable';

import {
  BuyButton,
  ConfigPanel,
  Container,
  ContentSection,
  HeadingSection,
  PageTab,
  PageTabs,
  SectionInner,
  TabsWrapper,
} from './styles';

export default function SpaceDetailPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <HeadingSection>
        <FeaturedContainer
          content={<SpaceFeaturedContent />}
          media={<SpaceFeaturedMedia />}
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
          <AuctionDataTable />
        </SectionInner>
      </ContentSection>
    </Container>
  );
}
