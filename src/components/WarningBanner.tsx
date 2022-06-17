import React from 'react';
import { styled } from '@mui/material';
import Image from 'next/image';
const Wrapper = styled(`div`)`
  background: #f2b132;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  > div {
    display: flex;
    align-items: center;
    > :first-child {
      margin-right: 10px !important;
    }
  }
  > button {
    background: #f2b132;
    border: 1px solid black;
    color: #211d35;
    border-radius: 4px;
    padding: 10px 16px;
    cursor: pointer;
  }
`;

export default function WarningBanner({
  onClick,
  buttonText,
  children,
}: {
  children: React.ReactNode;
  buttonText: string;
  onClick?: () => void;
}) {
  return (
    <Wrapper>
      <div>
        <Image
          src="/icons/information.svg"
          height={16}
          width={16}
          alt="Inforamtion"
        />
        {children}
      </div>
      <button onClick={onClick}>{buttonText}</button>
    </Wrapper>
  );
}
