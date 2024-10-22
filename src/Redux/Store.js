import { configureStore } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import ClientAuth from "./ClientAuth";

const userPersistConfig = { key: 'Client', storage };
const userPersistReducer = persistReducer(userPersistConfig, ClientAuth);

const store = configureStore({
  reducer: {
    ClientAuth: userPersistReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
