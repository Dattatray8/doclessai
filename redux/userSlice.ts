import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authLoad: false,
  },
  reducers: {
    setAuthLoad: (state, action: PayloadAction<boolean>) => {
      state.authLoad = action.payload;
    },
  },
});

export const { setAuthLoad } = userSlice.actions;

export default userSlice.reducer;
