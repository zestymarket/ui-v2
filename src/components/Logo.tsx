import React from 'react';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';

const StyledLogoText = styled(`div`)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 45,
  fontWeight: 600,
  marginLeft: theme.spacing(),
  marginBottom: theme.spacing(),
  marginRight: theme.spacing(2),
  alignItems: `center`,
}));

const Logo = () => (
  <Grid item flexDirection="row" display="flex" alignItems="center">
    <Image src="/logo.png" alt="logo" width={40} height={40} />
    <StyledLogoText>zesty</StyledLogoText>
  </Grid>
);

export default Logo;
