import { styled } from '@mui/system';

export const Container = styled(`div`)({
  display: `flex`,
  alignItems: `stretch`,
  width: `100%`,
  maxWidth: 1220,
});

export const MediaSection = styled(`section`)({
  flexGrow: 1,
  marginLeft: `50px`,
});

export const ContentSection = styled(`section`)({
  width: `30%`,
  minWidth: 416,
});
