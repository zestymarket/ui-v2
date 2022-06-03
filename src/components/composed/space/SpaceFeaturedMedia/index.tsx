import React from 'react';

import { Wrapper } from './styles';

interface Props {
  src: string | undefined;
}

const SpaceFeaturedMedia: React.FC<Props> = ({ src }) => {
  return <Wrapper src={src} />;
};

export default SpaceFeaturedMedia;
