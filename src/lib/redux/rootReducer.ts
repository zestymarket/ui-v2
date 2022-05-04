import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import auctionBasketReducer from './auctionBasketSlice';
import formDataReducer from './formDataSlice';
import pendingTransactionsReducer from './pendingTransactionsSlice';

const persistConfig = {
  key: `root`,
  storage,
};

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer = combineReducers({
  auctionBasketReducer,
  formDataReducer,
  pendingTransactionsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
