import React, { FC, ReactNode } from 'react';

import { Container, ContentSection, MediaSection } from './styles';

interface IFeaturedContainer {
  content: ReactNode;
  media: ReactNode;
}

const FeaturedContainer: FC<IFeaturedContainer> = ({ content, media }) => {
  return (
    <Container>
      <ContentSection>{content}</ContentSection>
      <MediaSection>{media}</MediaSection>
    </Container>
  );
};

export default FeaturedContainer;
