import { formatIpfsUri } from '../helpers';
import Auction from './Auction';

export default class SpaceData {
  id: number;
  name: string;
  description: string;
  location: string;
  format: string;
  image: string;
  withdrawn: boolean;
  burned: boolean;
  creator: string;
  timeCreated: number;
  volume: number;
  auctions: Auction[];
  activeAuctions: Auction[] = [];
  hasActiveAuctions: boolean;

  constructor(tokenData: any, uri: any) {
    this.id = tokenData.id;
    this.name = uri.name;
    this.description = uri.description;
    this.location = uri.location;
    this.format = uri.format;
    this.image = formatIpfsUri(uri.image);
    this.withdrawn = !(tokenData.sellerNFTSetting?.withdrawn === false);
    this.creator = tokenData.creator;
    this.timeCreated = tokenData.timeCreated;
    this.volume = tokenData.cumulativeVolumeUSDC;
    this.burned = tokenData.burned;
    this.hasActiveAuctions = false;

    this.auctions = tokenData.sellerNFTSetting?.sellerAuctions.map(
      (sellerAuction: any) => new Auction(sellerAuction),
    );

    if (this.auctions) {
      const currentTime = Number((Date.now() / 1000).toFixed(0));

      this.auctions.forEach((auction: Auction) => {
        if (
          currentTime < Number(auction.sellerAuction.contractTimeEnd) &&
          auction.sellerAuction.cancelled === false
        ) {
          this.hasActiveAuctions = true;
          this.activeAuctions.push(auction);
        }
      });
    }
  }
}
