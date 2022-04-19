import React from 'react';
import { Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image';

const StyledWrapper = styled(Stack)(({ theme }) => ({
  height: 120,
  backgroundColor: theme.palette.background.default,
  marginTop: 40,
}));
const StyledCopywrite = styled(Typography)(({ theme }) => ({
  marginLeft: 16,
  color: theme.palette.text.secondary,
  fontWeight: 400,
  fontSize: 12,
}));
const StyledLink = styled(Link)(({ theme }) => ({
  marginLeft: 8,
  marginRight: 8,
  fontWeight: 400,
  fontSize: 14,
  color: theme.palette.text.secondary,
  textDecoration: `none`,
}));
const StyledIcons = styled(`div`)({
  marginLeft: 16,
});

const Footer = () => (
  <StyledWrapper
    direction="row"
    alignItems="center"
    justifyContent="space-evenly"
  >
    <Stack direction="row" alignItems="center">
      <Image src="/logo-name-faded.png" alt="logo" width={118} height={30} />
      <StyledCopywrite>Copyright 2021. All rights reserved</StyledCopywrite>
    </Stack>

    <Stack direction="row" alignItems="center">
      <Stack direction="row">
        <StyledLink>About</StyledLink>
        <StyledLink>Help</StyledLink>
        <StyledLink>Privacy Policy</StyledLink>
        <StyledLink>Terms of Service</StyledLink>
      </Stack>
      <Stack direction="row">
        <StyledIcons>
          <Image src="/icons/desktop.svg" alt="logo" width={14} height={14} />
        </StyledIcons>
        <StyledIcons>
          <Image src="/icons/document.svg" alt="logo" width={14} height={14} />
        </StyledIcons>
        <StyledIcons>
          <Image src="/icons/twitter.svg" alt="logo" width={14} height={14} />
        </StyledIcons>
        <StyledIcons>
          <Image src="/icons/telegram.svg" alt="logo" width={14} height={14} />
        </StyledIcons>
        <StyledIcons>
          <Image src="/icons/medium.svg" alt="logo" width={14} height={14} />
        </StyledIcons>
      </Stack>
    </Stack>
  </StyledWrapper>
);

export default Footer;
