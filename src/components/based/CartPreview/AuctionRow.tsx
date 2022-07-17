import React from 'react';
import { styled } from '@mui/material';
import CloseIcon from '../../../../public/icons/close.svg';
import { removeAuctionById } from '@/lib/redux/auctionBasketSlice';
import { useDispatch } from 'react-redux';
import {
  calculatePrice,
  getAuctionDuration,
  getAuctionStartsIn,
} from '@/utils/classes/Auction';

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
      svg {
        display: none;
        color: red;
        cursor: pointer;
        position: relative;
        top: 1px;
      }
      & + div {
        width: 300px;
      }
    }
    &.price {
      text-align: right;
    }
  }
  &:hover {
    .id > svg {
      display: block;
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

export default function AuctionRow({ auctionData }: { auctionData: any }) {
  const {
    id,
    priceStart,
    contractTimeStart,
    contractTimeEnd,
    auctionTimeStart,
    name,
  } = auctionData;

  const dispatch = useDispatch();

  const startsIn = getAuctionStartsIn(contractTimeStart);
  const price = calculatePrice(
    auctionTimeStart,
    contractTimeEnd,
    priceStart,
  ).toFixed(2);
  const duration = getAuctionDuration(contractTimeStart, contractTimeEnd);

  return (
    <Wrapper>
      <div className="id lightText">
        {id}
        <CloseIcon
          onClick={() => dispatch(removeAuctionById(id))}
          className="remove"
          width={20}
          height={20}
        />
      </div>
      <div className="campaign">
        <label>{name || `None`}</label>
        <span className="lightText">Starts in {startsIn}</span>
      </div>
      <div className="price">
        <p className="total">
          <h1>{price}</h1>
          <small>USDC</small>
        </p>
        <span className="lightText">Duration {duration}</span>
      </div>
    </Wrapper>
  );
}
