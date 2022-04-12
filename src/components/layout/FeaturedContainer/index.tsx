import React, { FC, ReactNode } from 'react';

import styles from './index.module.scss';

interface IFeaturedContainer {
  content: ReactNode;
  media: ReactNode;
}

const FeaturedContainer: FC<IFeaturedContainer> = ({ content, media }) => {
  return (
    <div className={styles.container}>
      <section className={styles.content}>{content}</section>
      <section className={styles.media}>{media}</section>
    </div>
  );
};

export default FeaturedContainer;
