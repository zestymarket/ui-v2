import { AuctionBasketData } from '@/components/based/AuctionDataTable';
import { createSlice } from '@reduxjs/toolkit';

const InitialAuctionState = {
  auctions: [] as AuctionBasketData[],
};

type AuctionStateType = typeof InitialAuctionState;

export const auctionBasketSlice = createSlice({
  name: `auctionBasket`,
  initialState: InitialAuctionState,
  reducers: {
    addAuction: (state: AuctionStateType, action) => {
      return {
        ...state,
        auctions: state.auctions.concat(action.payload),
      };
    },
    removeAuctionById: (state: AuctionStateType, action) => {
      return {
        ...state,
        auctions: state.auctions.filter(
          (auction) => auction.id !== action.payload,
        ),
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { addAuction, removeAuctionById } = auctionBasketSlice.actions;

export default auctionBasketSlice.reducer;
