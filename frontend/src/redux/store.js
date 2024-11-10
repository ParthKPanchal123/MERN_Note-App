// ./redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../redux/User/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer,
});

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    version: 1,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
export const persistor = persistStore(store);
