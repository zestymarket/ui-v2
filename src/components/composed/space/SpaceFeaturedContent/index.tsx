import Image from 'next/image';
import React from 'react';

import styles from './index.module.scss';

const SpaceFeaturedContent = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.main}>
        <div className={styles.title}>Back 2 Space</div>
        <a href="constructarcade.com">constructarcade.com</a>
        <div className={styles.description}>
          Iron || Rails is A WebXR western arcade shooter, where the players try
          to reach the highest position on the leaderboards by shooting the
          attacking enemies.
        </div>
      </section>
      <section className={styles.info}>
        <div className={styles.avatar}></div>
        <div className={styles.content}>
          <div className={styles.created}>
            Created by <b>0x247...88a</b>
          </div>
          <div className={styles.timestamp}>15 September, 2021 18:49 UTC</div>
        </div>
      </section>
    </div>
  );
};

export default SpaceFeaturedContent;
