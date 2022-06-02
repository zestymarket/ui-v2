import { createSlice } from '@reduxjs/toolkit';

export const formDataSlice = createSlice({
  name: `formData`,
  initialState: {
    formData: {},
  },
  reducers: {
    addData: (state, action) => {
      const newTransactions = Object.assign({}, state.formData, action.payload);
      return Object.assign({}, state, {
        formData: newTransactions,
      });
    },
    clearFormData: (state) =>
      Object.assign({}, state, {
        formData: {},
      }),
  },
});

// Action creators are generated for each case reducer function
export const { addData, clearFormData } = formDataSlice.actions;

export default formDataSlice.reducer;
