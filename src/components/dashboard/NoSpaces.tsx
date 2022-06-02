import { Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';

const StyledNoSpacesWrapper = styled(Stack)({
  width: 400,
  margin: `180px auto`,
});
const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 26,
  fontWeight: 700,
  margin: theme.spacing(2),
}));
const StyledSubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 18,
  marginBottom: theme.spacing(3),
}));

const NoSpaces = () => {
  const router = useRouter();

  const onCreateNewSpace = () => {
    router.push(`/create-space`);
  };

  return (
    <StyledNoSpacesWrapper alignItems="center">
      <Image
        src="/icons/empty.svg"
        width={64}
        height={64}
        alt="no-spaces-icon"
      />
      <StyledTitle>Nothing to see here</StyledTitle>
      <StyledSubTitle>Create space or campaign to start.</StyledSubTitle>
      <Button onClick={onCreateNewSpace}>New Space +</Button>
    </StyledNoSpacesWrapper>
  );
};

export default NoSpaces;
