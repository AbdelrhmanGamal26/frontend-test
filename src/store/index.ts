import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import userReducer from "./userSlice";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist the 'user' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
