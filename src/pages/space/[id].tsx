import React, { SyntheticEvent } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import SpaceFeaturedContent from '@/components/composed/space/SpaceFeaturedContent';
import SpaceFeaturedMedia from '@/components/composed/space/SpaceFeaturedMedia';
import FeaturedContainer from '@/components/layout/FeaturedContainer';
import OptionButtonGroup from '@/components/based/OptionButtonGroup';
import SwitchToggle from '@/components/based/SwitchToggle';
import AuctionDataTable from '@/components/based/AuctionDataTable';

import styles from './index.module.scss';

export default function SpaceDetailPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <section className={styles.heading}>
        <FeaturedContainer
          content={<SpaceFeaturedContent />}
          media={<SpaceFeaturedMedia />}
        />
        <div className={styles.tabsWrapper}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="detail-tabs"
            className={styles.tabs}
          >
            <Tab label="Auctions" className={styles.tab} />
            <Tab label="History" className={styles.tab} />
            <Tab label="Analytics" className={styles.tab} />
            <Tab label="About" className={styles.tab} />
          </Tabs>
          <Button className={styles.buy}>How do I buy?</Button>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.config}>
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
          </div>
          <AuctionDataTable />
        </div>
      </section>
    </div>
  );
}
