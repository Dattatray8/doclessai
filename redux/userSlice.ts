import { Theme } from "@/types/redux.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authLoad: false,
    userData: null,
    theme: "light" as Theme,
    authUser: null,
  },
  reducers: {
    setAuthLoad: (state, action: PayloadAction<boolean>) => {
      state.authLoad = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

export const { setAuthLoad, setUserData, setTheme, setAuthUser } =
  userSlice.actions;

export default userSlice.reducer;
