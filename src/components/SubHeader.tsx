import React from 'react';
import { IconButton, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Props {
  label: string;
  sublabel?: string;
}

const StyledSubHeader = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  maxWidth: 1400,
  alignItems: `flex-start`,
  margin: `auto`,
  padding: `${theme.spacing(4)} 0 ${theme.spacing(5)}`,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: 60,
  fontWeight: 700,
  marginTop: theme.spacing(),
}));

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontSize: `18px`,
  fontWeight: 400,
  lineHeight: `24px`,
  color: theme.palette.text.secondary,
}));

const SubHeader: React.FC<Props> = ({ label, sublabel }) => {
  const router = useRouter();

  return (
    <StyledSubHeader>
      <StyledStack>
        <IconButton onClick={() => router.back()}>
          <Image
            src="/icons/left-arrow.svg"
            alt="logo"
            width={34}
            height={10}
          />
        </IconButton>
        <StyledTitle>{label}</StyledTitle>
        {sublabel && <StyledSubTitle>{sublabel}</StyledSubTitle>}
      </StyledStack>
    </StyledSubHeader>
  );
};

export default SubHeader;
