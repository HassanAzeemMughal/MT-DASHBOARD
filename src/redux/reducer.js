import { createSlice } from "@reduxjs/toolkit";
export const generateReducer = (name) => {
  const slice = createSlice({
    name,
    initialState: { data: null },
    reducers: {
      setData: (state, action) => {
        state.data = action?.payload;
      },
    },
  });
  return { reducer: slice.reducer, actions: slice.actions };
};
export const getReducer = (name) => {
  const myReducer = generateReducer(name);
  const { setData } = myReducer.actions;

  return setData;
};
