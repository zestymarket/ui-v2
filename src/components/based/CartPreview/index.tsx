import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';
import { RootState } from '../../../lib/redux/rootReducer';
import Image from 'next/image';
import AuctionRow from './AuctionRow';
import Button from '@/components/Button';
import Link from 'next/link';
import { ConnectWalletContext } from '@/components/ConnectWalletProvider';
import { calculatePrice } from '@/utils/classes/Auction';

const Wrapper = styled(`div`)`
  padding: 16px 40px 16px 16px;
  border: 2px solid #f89524;
  background: #13101e;
  position: fixed;
  right: -2px;
  top: 20%;
  border-radius: 16px 0 0 16px;
  display: flex;
  align-items: flex-start;
  z-index: 1;
  .chevron {
    cursor: pointer;
  }
  > div {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    margin-top: -6px;
    > span {
      color: #bdb9c8;
      font-size: 15px;
      font-weight: 700;
    }
  }
  p.total {
    display: flex;
    align-items: baseline;
    margin: 0;
    h1 {
      font-size: 20px;
      color: #e5e5e5;
      margin: 0;
      & + small {
        font-size: 14px;
        color: #bdb9c8;
        margin-left: 5px;
      }
    }
  }
  .rows {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  footer {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    label {
      font-weight: 700;
      color: #837c99;
      font-size: 12px;
    }
    & + a,
    & + button {
      float: right;
      margin: 10px 0;
    }
  }
`;

export default function CartPreview() {
  const [isMini, setIsMini] = useState(true);
  const addedAuctions = useSelector(
    (state: RootState) => state.auctionBasketReducer.auctions,
  );
  const count = addedAuctions.length;
  const { address, onClickConnectWallet } = useContext(ConnectWalletContext);
  if (!count) return <></>;
  const total = addedAuctions.reduce(
    (sum, auction) =>
      (sum += calculatePrice(
        auction.auctionTimeStart,
        auction.contractTimeEnd,
        auction.priceStart,
      )),
    0,
  );
  return (
    <Wrapper onClick={() => isMini && setIsMini(!isMini)}>
      <Image
        src={`/icons/${isMini ? `left` : `right`}-chevron.svg`}
        alt="back"
        height={12}
        width={12}
        className="chevron"
        onClick={() => setIsMini(true)}
      />
      <div>
        <span>
          {count} item{count === 1 ? `` : `s`}
          {!isMini && ` added`}
        </span>
        {isMini ? (
          <p className="total">
            <h1>{total.toFixed(2)}</h1>
            <small>USDC</small>
          </p>
        ) : (
          <div>
            <div className="rows">
              {addedAuctions.map((auction) => (
                <AuctionRow auctionData={auction} key={auction.id} />
              ))}
            </div>
            <footer>
              <label>TOTAL</label>
              <p className="total">
                <h1>{total.toFixed(2)}</h1>
                <small>USDC</small>
              </p>
            </footer>
            {address && (
              <Link href="/review-order" passHref={true}>
                <Button onClick={() => null}>Buy now</Button>
              </Link>
            )}
            {!address && (
              <Button onClick={onClickConnectWallet}>Buy now</Button>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
