import React from 'react';
import { Stack, styled } from '@mui/material';
import Image from 'next/image';

interface Props {
  icon: string;
  name: string;
  value: string;
}

const StyledText = styled(`p`)({
  marginLeft: `8px`,
});

export default function WalletBalance({ icon, name, value }: Props) {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      style={{
        fontSize: 15,
        color: `#E5E5E5`,
        marginLeft: 18,
        lineHeight: `18px`,
      }}
    >
      <Image src={icon} alt={name} width={24} height={24} />
      <StyledText>
        {name} {value}
      </StyledText>
    </Stack>
  );
}
