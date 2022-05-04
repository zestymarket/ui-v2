import { createSlice } from '@reduxjs/toolkit';

export const auctionBasketSlice = createSlice({
  name: `auctionBasket`,
  initialState: {
    auctions: [],
  },
  reducers: {
    addAuction: (state, action) => {
      return Object.assign({}, state, {
        auctions: state.auctions.concat(action.payload),
      });
    },
    removeAuctionAtIndex: (state, action) => {
      return Object.assign({}, state, {
        auctions: state.auctions.slice(action.payload),
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { addAuction, removeAuctionAtIndex } = auctionBasketSlice.actions;

export default auctionBasketSlice.reducer;
