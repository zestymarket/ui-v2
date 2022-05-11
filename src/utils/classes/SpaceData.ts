import { formatIpfsUri } from '../helpers';
import { Auction } from '../types/Auctions';

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

    this.auctions = tokenData.sellerNFTSetting?.sellerAuctions;

    if (this.auctions) {
      const currentTime = Number((Date.now() / 1000).toFixed(0));

      this.auctions.forEach((sellerAuction: Auction) => {
        if (
          currentTime < Number(sellerAuction.contractTimeEnd) &&
          sellerAuction.cancelled === false
        )
          this.activeAuctions.push(sellerAuction);
      });
    }
  }
}
