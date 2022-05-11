import { Stack } from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image';

export const Wrapper = styled(`div`)({
  display: `flex`,
  flexDirection: `column`,
  height: `100%`,
});

export const MainSection = styled(`section`)({
  flexGrow: 1,

  '& > a': {
    color: `#837c99`,
    fontFamily: `Inter`,
    fontStyle: `normal`,
    fontWeight: 300,
    fontSize: 16,
    lineHeight: `19px`,
    marginBottom: 22,
    display: `block`,
    transition: `all 0.3s`,

    '&:hover': {
      color: `white`,
    },
  },
});

export const Actions = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const Title = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 700,
  fontSize: 60,
  lineHeight: `56px`,
  letterSpacing: `-0.02em`,
  marginBottom: 10,
});

export const Description = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 18,
  lineHeight: `24px`,
  color: `#837c99`,
});

export const InfoSection = styled(`div`)({
  display: `flex`,
  alignItems: `center`,
});

export const Avatar = styled(Image)({
  display: `block`,
  borderRadius: `50%`,
});

export const Content = styled(`div`)({
  display: `flex`,
  flexDirection: `column`,
  marginLeft: 10,
});

export const CreatedInfo = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: `17px`,
  color: `#f89c24`,

  '& > b': {
    color: `white`,
    fontWeight: 400,
  },
});

export const TimestampInfo = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: `15px`,
  color: `#837c99`,
  marginTop: 5,
});
