import { configureStore } from "@reduxjs/toolkit";
import { websiteApi } from "./websiteApi.js";

export const store = configureStore({
  reducer: {
    [websiteApi.reducerPath]: websiteApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websiteApi.middleware)
});
