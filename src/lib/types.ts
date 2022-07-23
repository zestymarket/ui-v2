export interface TokenData {
  id: string;
  tokenGroup: string;
  creator: string;
  owner: string;
  timeCreated: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  uri: string;
  timestamp: string;
  sellerNFTSetting?: SellerNFTSetting;
  cumulativeVolumeUSDC: number;
  burned: boolean;
}

export interface SellerAuction {
  id: string;
  seller: string;
  currency: string;
  auctionTimeStart: string;
  auctionTimeEnd: string;
  contractTimeStart: string;
  contractTimeEnd: string;
  priceStart: string;
  priceEnd: string;
  buyerCampaignsApproved: boolean[];
  buyerCampaignsPending: boolean[];
  cancelled: boolean;
  rate?: number;
  sellerNFTSetting?: SellerNFTSetting;
}

export interface SellerNFTSetting {
  id: string;
  tokenData: TokenData;
  seller: string;
  autoApprove: boolean;
  inProgressCount: number;
  sellerAuctions: SellerAuction[];
  withdrawn: boolean;
}

export interface SellerNFTSettingQuery {
  sellerNFTSetting?: SellerNFTSetting;
  sellerNFTSettings?: SellerNFTSetting[];
}

export interface SellerNFTSettingVars {
  id?: string;
  publisher?: string;
  publisher_not?: string;
  advertiser?: string;
  tokenId?: string;
  tokenGroup?: string;
  timeNow?: number;
  auctionTimeEnd?: number;
  auctionTimeEnd_gt?: number;
  timeStart?: number;
  timeStart_lte?: number;
  cancelled?: boolean;
  first?: number;
  skip?: number;
}

export interface TokenDataVars {
  id?: string;
  creator?: string;
  owner?: string;
  burned?: boolean;
  approved?: boolean;
  cumulativeVolumeUSDC?: number;
  first?: number;
  skip?: number;
}

export interface UriResponse {
  name: string;
  description: string;
  location: string;
  format: string;
  image: string;
}
