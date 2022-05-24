import { SellerAuction } from '@/lib/types';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits, formatEther } from '@ethersproject/units';
import Auction from './classes/Auction';

export const EPSILON = 0.000001;

export function shortenHex(hex: string, length = 4): string {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length,
  )}`;
}

export function calcPrice(
  timeNow: BigNumber,
  timeStart: BigNumber,
  timeEndToken: BigNumber,
  startPrice: BigNumber,
): BigNumber {
  const timePassed = timeNow.sub(timeStart);
  const timeTotal = timeEndToken.sub(timeStart);
  const reStartPrice = startPrice.mul(100000);
  const gradient = reStartPrice.div(timeTotal);
  const bidPrice = reStartPrice.sub(gradient.mul(timePassed)).div(100000);

  return BigNumber.from(
    Math.max(
      Math.min(bidPrice.toNumber(), reStartPrice.div(100000).toNumber()),
      0,
    ),
  );
}

export function formatPrice(input: BigNumber, decimals = 4): string {
  return parseFloat(formatEther(input)).toFixed(decimals);
}

export function formatUSDC(rawUsdc: BigNumber): string {
  return Number(formatUnits(rawUsdc, 6)).toFixed(2);
}

//prepends https:// to a string if it does not already have http:// or https://
export function addHttps(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    return `https://` + url;
  }
  return url;
}

export function removeHttps(url: string) {
  const result = url.replace(/(^\w+:|^)\/\//, ``);
  return result;
}

export function getDomain(url: string) {
  const u = new URL(addHttps(url));
  return u.host;
}

export function formatIpfsUri(uri: string) {
  if (uri.substring(0, 4) === `ipfs`) {
    return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${uri.substring(7)}`;
  } else {
    return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${uri}`;
  }
}

export const CHAIN_ID_NAMES: { [key: number]: string } = {
  1: `Mainnet`,
  3: `Ropsten`,
  4: `Rinkeby`,
  5: `Görli`,
  42: `Kovan`,
  137: `Polygon`,
};

export const INFURA_PREFIXES: { [key: number]: string } = {
  1: `mainnet`,
  3: `ropsten`,
  4: `rinkeby`,
  5: `goerli`,
  42: `kovan`,
  137: `polygon-mainnet`,
};

export function isOpenAuction(auction: Auction) {
  const currentTime = parseInt((Date.now() / 1000).toFixed(0));

  const cancelled = auction.sellerAuction.cancelled;
  if (cancelled === true) return false;

  const auctionStart = Number(auction.sellerAuction.auctionTimeStart);
  if (auctionStart > currentTime) return false;

  const auctionEnd = Number(auction.sellerAuction.auctionTimeEnd);
  if (auctionEnd < currentTime) return false;

  const approved = auction.sellerAuction.buyerCampaignsApproved;
  if (approved[approved.length - 1] === true) return false;

  const pending = auction.sellerAuction.buyerCampaignsPending;
  if (pending[pending.length - 1] === true) return false;

  return true;
}

export function getLowestAuctionPrice(auctions: Auction[]) {
  const currentTime = parseInt((Date.now() / 1000).toFixed(0));

  const lowestPrice = auctions.reduce((acc, auction) => {
    const auctionPrice = calcPrice(
      BigNumber.from(currentTime),
      BigNumber.from(auction.sellerAuction.auctionTimeStart),
      BigNumber.from(auction.sellerAuction.auctionTimeEnd),
      BigNumber.from(auction.sellerAuction.priceStart),
    );

    return isOpenAuction(auction) === true
      ? Math.min(auctionPrice.toNumber(), acc)
      : acc;
  }, Number.MAX_VALUE);

  return lowestPrice;
}

export function getLowestAuctionEndTime(auctions: Auction[]) {
  const lowestTime = auctions.reduce(
    (acc, auction) =>
      isOpenAuction(auction) === true
        ? Math.min(Number(auction.sellerAuction.auctionTimeEnd), acc)
        : acc,
    Number.MAX_VALUE,
  );

  return lowestTime;
}

export function hasOpenAuction(auctions: Auction[]) {
  for (let i = 0; i < auctions.length; i++) {
    if (isOpenAuction(auctions[i])) return true;
  }
  return false;
}

export function formatTimeLeft(s: number): string {
  const minutes = Number((s / 60).toFixed(0));
  const hours = Number((minutes / 60).toFixed(0));
  const days = Number((hours / 24).toFixed(1));

  if (minutes < 60) return `${minutes} minute${minutes === 1 ? `` : `s`}`;
  if (hours < 24) return `${hours} hour${hours === 1 ? `` : `s`}`;
  return `${days} day${days === 1 ? `` : `s`}`;
}

export function toDate(s: number): string {
  return new Date(s * 1000).toLocaleString();
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
