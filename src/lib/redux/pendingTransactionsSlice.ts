import { createSlice } from '@reduxjs/toolkit';

export const pendingTransactionsSlice = createSlice({
  name: `transactionBasket`,
  initialState: {
    transactions: {},
  },
  reducers: {
    addTransaction: (state, action) => {
      const newTransactions: any = Object.assign({}, state.transactions);
      newTransactions[action.payload.id] = action.payload;
      return Object.assign({}, state, {
        transactions: newTransactions,
      });
    },
    removeTransaction: (state, action) => {
      const newTransactions: any = Object.assign({}, state.transactions);
      delete newTransactions[action.payload];
      return Object.assign({}, state, {
        transactions: newTransactions,
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { addTransaction, removeTransaction } =
  pendingTransactionsSlice.actions;

export default pendingTransactionsSlice.reducer;
