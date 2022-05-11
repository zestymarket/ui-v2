import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { calcPrice } from '../helpers';

export interface Auction {
  auctionTimeEnd: string;
  auctionTimeStart: string;
  buyerCampaigns: BuyerCampaign[];
  buyerCampaignsApproved: boolean[];
  buyerCampaignsPending: boolean[];
  cancelled: boolean;
  contract: Contract;
  contractTimeEnd: string;
  contractTimeStart: string;
  currency: string;
  id: string;
  priceEnd: string;
  pricePending: string;
  priceStart: string;
  seller: string;
  __typename: string;
}

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

function currentTime(): number {
  return Number((Date.now() / 1000).toFixed(0));
}

export function getPrice(auction: Auction): number {
  if (auction.buyerCampaignsApproved.slice(-1)[0] !== true) {
    const price = calcPrice(
      BigNumber.from(currentTime()),
      BigNumber.from(auction.auctionTimeStart),
      BigNumber.from(auction.contractTimeEnd),
      BigNumber.from(auction.priceStart),
    );
    return Number(formatUnits(price, 6));
  }
  const price = BigNumber.from(auction.priceEnd);
  return Number(formatUnits(price, 6));
}
