import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  name: string;
  email: string;
};

export type UserState = {
  user: User | null;
  isLoggedIn: boolean;
  accessToken: string | null;
};

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  accessToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(
      state: UserState,
      action: PayloadAction<User & { accessToken: string }>
    ) {
      state.user = { name: action.payload.name, email: action.payload.email };
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
    },
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.accessToken = null;
    },
  },
});

export const { login, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
