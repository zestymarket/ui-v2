import React from 'react';
import { IconButton, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';

interface Props {
  label: string;
  backLinkHref?: string;
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

const SubHeader: React.FC<Props> = ({ label }) => {
  return (
    <StyledSubHeader>
      <StyledStack>
        <IconButton>
          <Image
            src="/icons/left-arrow.svg"
            alt="logo"
            width={34}
            height={10}
          />
        </IconButton>
        <StyledTitle>{label}</StyledTitle>
      </StyledStack>
    </StyledSubHeader>
  );
};

export default SubHeader;
