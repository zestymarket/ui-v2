import React from 'react';
import { styled } from '@mui/material';
import { AuctionData } from '../AuctionDataTable';

const Wrapper = styled(`div`)`
  display: flex;
  width: 500px;
  padding: 7px 0 10px 0;
  border-bottom: 1px solid rgba(131, 124, 153, 0.6);
  .lightText {
    font-family: Arial;
    font-size: 15px;
    color: #bdb9c8;
  }
  > div {
    display: flex;
    flex-direction: column;
    &.id {
      margin-right: 20px;
      & + div {
        width: 300px;
      }
    }
    &.price {
      text-align: right;
    }
  }
  label {
    font-size: 15px;
    color: #e5e5e5;
    font-weight: 700;
  }
  p.total {
    display: flex;
    align-items: baseline;
    margin: 0;
    h1 {
      font-size: 15px;
      color: #e5e5e5;
      margin: 0;
      & + small {
        font-size: 14px;
        color: #bdb9c8;
        margin-left: 5px;
      }
    }
  }
`;

export default function AuctionRow({
  auctionData,
}: {
  auctionData: AuctionData;
}) {
  const { id, price, contractStartTime, duration, campaign } = auctionData;
  return (
    <Wrapper>
      <div className="id lightText">{id}</div>
      <div className="campaign">
        <label>{campaign || `None`}</label>
        <span className="lightText">Starts at {contractStartTime}</span>
      </div>
      <div className="price">
        <p className="total">
          <h1>{price.toFixed(2)}</h1>
          <small>USDC</small>
        </p>
        <span className="lightText">Duration {duration}</span>
      </div>
    </Wrapper>
  );
}
