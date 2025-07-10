import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { generateReducer } from "./reducer";
import generate from "./generate";
import { fetchDataThunk } from "./actions/fetchData";

export const fetchUserList = fetchDataThunk("userList", "user/list");

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["token", "userInfo"],
};
// 

const rootReducer = combineReducers({
  userInfo: generateReducer("userInfo").reducer,
  token: generateReducer("token").reducer,
  userList: generate("userList", fetchUserList),
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
