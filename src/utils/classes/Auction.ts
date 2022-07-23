import { SellerAuction } from '@/lib/types';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import moment from 'moment';
import { calcPrice, formatIpfsUri, formatTimeLeft, toDate } from '../helpers';

export interface BuyerCampaign {
  buyer: string;
  id: string;
  uri: string;
  __typename: string;
}

export interface Contract {
  contractValue: string;
  id: string;
  withdrawn: boolean;
  __typename: string;
}

export enum AUCTION_STATUS {
  'no_bids',
  'not_started',
  'awaiting_approval',
  'active', //was bought and is currently displaying the campaign
  'bought', //was bid on and approved
  'expired', //ended with no approved bids
  'finished', //was bought and contract is over
}

export const getAuctionStartsIn = function (contractTimeStart: string): string {
  const dur = moment.duration(
    moment.unix(Number(contractTimeStart)).diff(moment()),
  );

  const monthsRemain = dur.months();
  const daysRemain = dur.days();
  const hoursRemain = dur.hours();
  const minutesRemain = dur.minutes();
  const secondsRemain = dur.seconds();

  if (
    monthsRemain < 0 ||
    daysRemain < 0 ||
    hoursRemain < 0 ||
    minutesRemain < 0 ||
    secondsRemain < 0
  ) {
    return `Already started`;
  }

  if (monthsRemain) {
    return `${monthsRemain} month${
      monthsRemain !== 1 ? `s` : ``
    } ${daysRemain} day${daysRemain !== 1 ? `s` : ``}`;
  }

  if (daysRemain) {
    return `${daysRemain} day${
      daysRemain !== 1 ? `s` : ``
    } ${hoursRemain} hour${hoursRemain !== 1 ? `s` : ``}`;
  }

  if (hoursRemain) {
    return `${hoursRemain} hour${
      hoursRemain !== 1 ? `s` : ``
    } ${minutesRemain} min${minutesRemain !== 1 ? `s` : ``}`;
  }

  if (minutesRemain) {
    return `${minutesRemain} min${
      minutesRemain !== 1 ? `s` : ``
    } ${secondsRemain} sec${secondsRemain !== 1 ? `s` : ``}`;
  } else {
    return `${secondsRemain} sec${secondsRemain !== 1 ? `s` : ``}`;
  }
};

const getCurrentTime = function (): number {
  return Number((Date.now() / 1000).toFixed(0));
};

export const getContractDuration = function (
  contractTimeStart: string,
  contractTimeEnd: string,
): string {
  const currentTime = getCurrentTime();
  if (
    currentTime > Number(contractTimeStart) &&
    currentTime < Number(contractTimeEnd)
  ) {
    return formatTimeLeft(Number(contractTimeEnd) - currentTime);
  } else {
    return formatTimeLeft(Number(contractTimeEnd) - Number(contractTimeStart));
  }
};

export function getAuctionStatus(auction: any) {
  const currentTime = parseInt((Date.now() / 1000).toFixed(0));

  const campaignsApproved = auction.buyerCampaignsApproved;
  const campaignsPending = auction.buyerCampaignsPending;
  const contractStart = auction.contractTimeStart;
  const contractEnd = auction.contractTimeEnd;
  const auctionStart = Number(auction.auctionTimeStart);

  if (currentTime < auctionStart) return AUCTION_STATUS.not_started;

  if (campaignsApproved[campaignsApproved.length - 1] === true) {
    if (currentTime < contractStart) return AUCTION_STATUS.bought;
    if (currentTime < contractEnd) return AUCTION_STATUS.active;
    return AUCTION_STATUS.finished;
  }

  if (currentTime > contractEnd) return AUCTION_STATUS.expired;

  if (campaignsPending[campaignsPending.length - 1] === true)
    return AUCTION_STATUS.awaiting_approval;

  return AUCTION_STATUS.no_bids;
}

export const calculatePrice = function (
  auctionTimeStart: string,
  contractTimeEnd: string,
  priceStart: string,
) {
  const price = calcPrice(
    BigNumber.from(getCurrentTime()),
    BigNumber.from(auctionTimeStart || 0),
    BigNumber.from(contractTimeEnd || 0),
    BigNumber.from(priceStart || 0),
  );
  return Number(formatUnits(price, 6));
};

export const hasAuctionEnded = function (auctionTimeEnd: string): boolean {
  return Number(auctionTimeEnd) <= getCurrentTime();
};

export default class Auction {
  buyerCampaign: BuyerCampaign;
  buyerCampaignUri: any;
  sellerAuction: SellerAuction;
  status: AUCTION_STATUS;
  contract: Contract;
  id: number;
  spaceId?: number;
  constructor(sellerAuction: any) {
    this.sellerAuction = sellerAuction;
    this.status = getAuctionStatus(sellerAuction);
    this.buyerCampaign = sellerAuction.buyerCampaigns.slice(-1)[0];
    this.contract = sellerAuction.contract;
    this.id = Number(sellerAuction.id);
    this.spaceId = Number(sellerAuction?.sellerNFTSetting?.tokenData?.id);
  }

  async getBuyercampaignUri(cb: any) {
    if (this.buyerCampaign) {
      const url = formatIpfsUri(this.buyerCampaign.uri);
      return fetch(url).then((res) => {
        res.json().then((campaignUri) => {
          cb(this.buyerCampaign.id, campaignUri);
        });
      });
    }
  }

  async getSpaceData(cb: any) {
    if (this.sellerAuction.sellerNFTSetting?.tokenData) {
      const url = formatIpfsUri(
        this.sellerAuction.sellerNFTSetting?.tokenData.uri,
      );
      return fetch(url).then((res) => {
        res.json().then((tokenData) => {
          cb(this.sellerAuction.id, tokenData);
        });
      });
    }
  }

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
  contractEndDateTime(): string {
    return toDate(Number(this.sellerAuction.contractTimeEnd));
  }

  contractStartDateTime(): string {
    if (this.currentTime() > Number(this.sellerAuction.contractTimeStart)) {
      return toDate(this.currentTime());
    } else {
      return toDate(Number(this.sellerAuction.contractTimeStart));
    }
  }

  contractDuration(): string {
    return getContractDuration(
      this.sellerAuction.contractTimeStart,
      this.sellerAuction.contractTimeEnd,
    );
  }
}
