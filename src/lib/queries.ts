import { gql } from '@apollo/client';

const TokenDataFullData = `
id
creator
owner
approved
timeCreated
uri
zestyTokenValue
burned
cumulativeVolumeUSDC
`;

const AuctionFullData = `
id
currency
seller
auctionTimeStart
auctionTimeEnd
contractTimeStart
contractTimeEnd
priceStart
pricePending
priceEnd
buyerCampaigns {
  id
  buyer
  uri
}
contract {
  id
  contractValue
  withdrawn
}
buyerCampaignsPending
buyerCampaignsApproved
cancelled
`;

const BuyerCampaignFullData = `
id
buyer
uri
`;

export const GET_ONE_ZESTY_NFT = gql`
  query GetZestyNFT($id: String!) {
    tokenData(id: $id) {
      sellerNFTSetting {
        sellerAuctions(first: 400) {
          ${AuctionFullData}
        }
        withdrawn
      }
      ${TokenDataFullData}
    }
  }
`;

export const GET_ZESTY_NFT_CONTRACTTIMESTART_BETWEEN = gql`
  query GetZestyNFTContractTimeStartBetween(
    $id: String!, $first: Int, $start: Int!, $end: Int!) {
    sellerNFTSetting(id: $id) {
      sellerAuctions(
        first: $first,
        where: {
          contractTimeStart_gte: $start,
          contractTimeStart_lte: $end
        }
      ) {
        buyerCampaigns {
          ${BuyerCampaignFullData}
        }
        ${AuctionFullData}
      }
    }
  }
`;

export const GET_ZESTY_NFT_CONTRACTTIMEEND_BETWEEN = gql`
  query GetZestyNFTContractTimeEndBetween(
    $id: String!, $first: Int, $skip: Int, $start: Int!, $end: Int!) {
    sellerNFTSetting(id: $id) {
      sellerAuctions(
        skip: $skip
        first: $first,
        where: {
          contractTimeEnd_gte: $start,
          contractTimeEnd_lte: $end
        }
      ) {
        buyerCampaigns {
          ${BuyerCampaignFullData}
        }
        ${AuctionFullData}
      }
    }
  }
`;

export const GET_ALL_ZESTY_NFTS = gql`
  query GetAllZestyNFTs($first: Int!, $skip: Int!) {
    tokenDatas(
      first: $first,
      skip: $skip
    ) {
      ${TokenDataFullData}
    }
  }
`;

export const GET_ZESTY_NFT_BY_CREATOR = gql`
  query GetZestyNFTByCreator(
    $creator: String!,
    $first: Int!,
    $skip: Int!
  ) {
    tokenDatas(
      first: $first,
      skip: $skip,
      where: {
        creator: $creator,
        burned: false
      }
    ) {
      sellerNFTSetting{
        sellerAuctions(first: 400) {
          ${AuctionFullData}
        }
      }
      ${TokenDataFullData}
    }
  }
`;

export const GET_ZESTY_NFT_BY_OWNER = gql`
  query GetZestyNFTByOwner(
    $owner: String!,
    $first: Int!,
    $skip: Int!
  ) {
    tokenDatas(
      first: $first,
      skip: $skip,
      where: {
        owner: $owner,
      }
    ) {
      ${TokenDataFullData}
    }
  }
`;

export const GET_ACTIVE_SPACES = gql`
  query GetActiveSpaces(
    $first: Int!,
    $skip: Int!,
    $cancelled: Boolean,
    $burned: Boolean,
    $timeNow: Int!
  ) {
    sellerNFTSettings(
      first: $first,
      skip: $skip
    ) {
      id,
      seller,
      tokenData(
        where: {
          burned: $burned
        }
      ) {
        ${TokenDataFullData}
      }
      sellerAuctions(
        orderBy: priceStart,
        first: 400,
        where: {
          cancelled: $cancelled
          auctionTimeEnd_gt: $timeNow
        }
      ) {
        ${AuctionFullData}
      }
    }
  }
`;

export const GET_AUCTION_BY_NFT = gql`
  query GetAuctionByNFT($id: String!, $first: Int!, $skip: Int) {
    sellerNFTSetting(id: $id) {
      withdrawn
      sellerAuctions(first: $first, skip: $skip) {
        buyerCampaigns {
          ${BuyerCampaignFullData}
        }
        contract {
          id
          contractValue
          withdrawn
        }
        ${AuctionFullData}
      }
    }
  }
`;

export const GET_AUCTION_BY_CAMPAIGN = gql`
  query GetAuctionByCampaign($id: String!, $first: Int!, $skip: Int) {
    buyerCampaign(id: $id) {
      sellerAuctions(first: $first, skip: $skip) {
        sellerNFTSetting {
          tokenData {
            ${TokenDataFullData}
          }
        }
        ${AuctionFullData}
      }
      ${BuyerCampaignFullData}
    }
  }
`;

export const GET_USER_DATA = gql`
  query GetUserData($id: String!) {
    user(id: $id) {
      id
      USDCReceived
      USDCSent
    }
  }
`;

export const GET_CAMPAIGN_BY_BUYER = gql`
  query GetCampaignByBuyer(
    $buyer: String!,
    $first: Int!,
    $skip: Int!,
  ) {
    buyerCampaigns(
      first: $first,
      skip: $skip,
      where: {
        buyer: $buyer
      }
    ) {
      ${BuyerCampaignFullData}
    }
  }
`;

export const GET_ONE_CAMPAIGN = gql`
  query GetOneCampaign(
    $id: String!,
  ) {
    buyerCampaign(id: $id) {
      ${BuyerCampaignFullData}
    }
  }
`;

const HTLCFullData = `
id
publisher
advertiser
tokenGroup
tokenId
amount
hashlock
timelock
shares
totalShares
state
timestamp
`;

export const GET_ONE_HTLC = gql`
  query GetHTLC($id: String!) {
    htlc(id: $id) {
      ${HTLCFullData}
    }
  }
`;

export const GET_HTLC_BY_PUBLISHER = gql`
  query GetHTLCByPublisher($publisher: String!, $first: Int!, $skip: Int!) {
    htlcs(
      first: $first,
      skip: $skip,
      where: {
        publisher: $publisher
      }
    ) {
      ${HTLCFullData}
    }
  }
`;

export const GET_HTLC_BY_ADVERTISER = gql`
  query GetHTLCByPublisher(
    $advertiser: String!,
    $first: Int!,
    $skip: Int!,
    $state: String!
  ) {
    htlcs(
      first: $first,
      skip: $skip,
      where: {
        advertiser: $advertiser
        state: $state
      }
    ) {
      ${HTLCFullData}
    }
  }
`;

export const GET_HTLC_BY_STATE = gql`
  query GetHTLCByState(
    $first: Int!,
    $skip: Int!,
    $state: String!
  ) {
    htlcs(
      first: $first,
      skip: $skip,
      where: {
        state: $state
      }
    ) {
      ${HTLCFullData}
    }
  }
`;
