import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  userId: string;
  name: string;
  email: string;
  photo?: string;
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
      state.user = {
        userId: action.payload.userId,
        name: action.payload.name,
        email: action.payload.email,
        photo: action.payload.photo,
      };
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
    },
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    // updateUserData: (state, action) => {
    //   if (state.user) {
    //     state.user.name = action.payload.name;
    //     state.user.photo = action.payload.photo;
    //   }
    // },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.accessToken = null;
    },
  },
});

// export const { login, setToken, updateUserData, logout } = userSlice.actions;
export const { login, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
