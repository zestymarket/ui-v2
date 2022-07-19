import React, { useContext, useState } from 'react';
import { styled } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectWalletContext } from '@/components/ConnectWalletProvider';
import {
  AUCTION_STATUS,
  calculatePrice,
  hasAuctionEnded,
} from '@/utils/classes/Auction';
import { removeAuctionById } from '@/lib/redux/auctionBasketSlice';
import { AuctionData } from '../AuctionDataTable';

const Wrapper = styled(`div`)`
  height: 180px;
  padding: 16px 40px 16px 16px;
  border: 2px solid #f89524;
  background: #13101e;
  position: fixed;
  right: -30px;
  top: 20%;
  border-radius: 16px 0 0 16px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  z-index: 1;
`;

const Button = styled(`button`)`
  width: 40px;
  height: 40px;
  background: linear-gradient(112.17deg, #f89724 0%, #e23f26 100%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin-top: -11px;
  margin-bottom: -10.5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

interface Props {
  auctions: AuctionData[];
}

const AuctionActions: React.FC<Props> = ({ auctions }) => {
  if (!auctions?.length) return <></>;

  const isCancellable = auctions.every((auction) => {
    return auction.status === AUCTION_STATUS.no_bids;
  });

  const isApprovable = auctions.every((auction) => {
    return auction.status === AUCTION_STATUS.awaiting_approval;
  });

  return (
    <Wrapper>
      <Button
        disabled={isCancellable}
        onClick={() => console.log(isCancellable)}
      >
        <Image src="/icons/check-mark.svg" alt="cart" height={16} width={16} />
      </Button>
      <Button disabled={isCancellable}>
        <Image src="/icons/cross.svg" alt="cart" height={16} width={16} />
      </Button>
      <Button disabled={isApprovable} onClick={() => console.log(isApprovable)}>
        <Image src="/icons/trash.svg" alt="cart" height={16} width={16} />
      </Button>
    </Wrapper>
  );
};

export default AuctionActions;
