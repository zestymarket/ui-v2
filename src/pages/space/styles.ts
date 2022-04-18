import { Button, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';

export const Container = styled(`div`)({
  display: `flex`,
  flexDirection: `column`,
  width: `100%`,
});

export const HeadingSection = styled(`section`)({
  background: `#181522`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
});

export const TabsWrapper = styled(`div`)({
  width: `100%`,
  maxWidth: 1220,
  display: `flex`,
  marginTop: 66,
});

export const BuyButton = styled(Button)({
  fontFamily: `Inter`,
  textTransform: `none`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 18,
  color: `#bdb9c8`,
  padding: `16px 16px`,
  lineHeight: 0,
  borderRadius: `0 !important`,
  opacity: 0.5,
  transition: `all 0.3s`,

  '&:hover': {
    opacity: 1,
  },
});

export const PageTabs = styled(Tabs)({
  width: `420px`,

  '.MuiTabs-indicator': {
    background: `#f89c24`,
  },
});

export const PageTab = styled(Tab)({
  fontFamily: `Inter`,
  textTransform: `none`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: `18px`,
  color: `#bdb9c8`,
  opacity: 1,
  padding: `16px 0`,
  lineHeight: 0,

  '.Mui-selected': {
    color: `#f89c24`,
  },
});

export const ContentSection = styled(`section`)({
  background: `#211d35`,
  minHeight: 500,
  display: `flex`,
  justifyContent: `center`,
});

export const SectionInner = styled(`div`)({
  padding: `40px 0`,
  width: 1220,
});

export const ConfigPanel = styled(`div`)({
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  marginBottom: 30,
});
