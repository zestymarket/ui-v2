import { SellerAuction } from '@/lib/types';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import moment from 'moment';
import { calcPrice, formatIpfsUri, formatTimeLeft, toDate } from '../helpers';

export enum AUCTION_STATUS {
  'no_bids',
  'not_started',
  'awaiting_approval',
  'active', //was bought and is currently displaying the campaign
  'bought', //was bid on and approved
  'expired', //ended with no approved bids
  'finished', //was bought and contract is over
}

export const calculatePrice = function (
  auctionTimeStart: string,
  contractTimeEnd: string,
  priceStart: string,
) {
  const price = calcPrice(
    BigNumber.from(getCurrentTime()),
    BigNumber.from(auctionTimeStart),
    BigNumber.from(contractTimeEnd),
    BigNumber.from(priceStart),
  );
  return Number(formatUnits(price, 6));
};

export const hasAuctionEnded = function (contractTimeEnd: string): boolean {
  return Number(contractTimeEnd) <= getCurrentTime();
};

export default class SellerAuction {
  currentTime(): number {
    return Number((Date.now() / 1000).toFixed(0));
  }

  price(): number {
    if (this.sellerAuction.buyerCampaignsApproved.slice(-1)[0] !== true) {
      const price = calcPrice(
        BigNumber.from(this.currentTime()),
        BigNumber.from(this.sellerAuction.auctionTimeStart),
        BigNumber.from(this.sellerAuction.contractTimeEnd),
        BigNumber.from(this.sellerAuction.priceStart),
      );
      return Number(formatUnits(price, 6));
    }
    const price = BigNumber.from(this.sellerAuction.priceEnd);
    return Number(formatUnits(price, 6));
  }

  auctionStartsIn(): string {
    return getAuctionStartsIn(this.sellerAuction.contractTimeStart);
  }

  auctionEndsIn(): string {
    return formatTimeLeft(
      Number(this.sellerAuction.auctionTimeEnd) - this.currentTime(),
    );
  }

  contractStartsIn(): string {
    return formatTimeLeft(
      Number(this.sellerAuction.contractTimeStart) - this.currentTime(),
    );
  }

  contractEndsIn(): string {
    return formatTimeLeft(
      Number(this.sellerAuction.contractTimeEnd) - this.currentTime(),
    );
  }

  contractStartDateTime(): string {
    if (this.currentTime() > Number(this.sellerAuction.contractTimeStart)) {
      return toDate(this.currentTime());
    } else {
      return toDate(Number(this.sellerAuction.contractTimeStart));
    }
  }

  contractDuration(): string {
    return getAuctionDuration(
      this.sellerAuction.contractTimeStart,
      this.sellerAuction.contractTimeEnd,
    );
  }
}
