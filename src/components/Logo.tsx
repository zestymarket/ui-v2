import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Grid, styled } from '@mui/material';

const StyledLogoText = styled(`div`)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 45,
  fontWeight: 600,
  marginLeft: theme.spacing(),
  marginBottom: theme.spacing(),
  marginRight: theme.spacing(2),
  alignItems: `center`,
}));

const StyledGrid = styled(Grid)({
  userSelect: `none`,
  cursor: `pointer`,
});

const Logo = () => (
  <Link href="/" passHref>
    <StyledGrid item flexDirection="row" display="flex" alignItems="center">
      <Image src="/logo.png" alt="logo" width={40} height={40} />
      <StyledLogoText>zesty</StyledLogoText>
    </StyledGrid>
  </Link>
);

export default Logo;
