import { SellerAuction, TokenData, UriResponse } from '@/lib/types';
import { convertOldFormats } from './formats';
import { formatIpfsUri } from './helpers';

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
  auctions: any;
  activeAuctions: SellerAuction[] = [];
  hasActiveAuctions: boolean;

  constructor(tokenData: TokenData, uri: UriResponse) {
    this.id = +tokenData.id;
    this.name = uri.name;
    this.description = uri.description;
    this.location = uri.location;
    this.format = convertOldFormats(uri.format);
    this.image = formatIpfsUri(uri.image);
    this.withdrawn = !(tokenData.sellerNFTSetting?.withdrawn === false);
    this.creator = tokenData.creator;
    this.timeCreated = +tokenData.timeCreated;
    this.volume = tokenData.cumulativeVolumeUSDC;
    this.burned = tokenData.burned;

    this.auctions = tokenData.sellerNFTSetting?.sellerAuctions;

    this.hasActiveAuctions = false; // todo

    if (this.auctions) {
      const currentTime = Number((Date.now() / 1000).toFixed(0));

      this.auctions.forEach((sellerAuction: SellerAuction) => {
        if (
          currentTime < +sellerAuction.contractTimeEnd &&
          sellerAuction.cancelled === false
        )
          this.activeAuctions.push(sellerAuction);
      });
    }
  }
}
