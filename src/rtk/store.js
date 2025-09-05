import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";
import socketMiddleware from "../utils/useSocket ";
import { updateTradeTime } from "./slices/orderSlice/orderSlice";

const store = configureStore({
    reducer:rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            immutableCheck: false, // Disable ImmutableStateInvariantMiddleware
            serializableCheck: false, // Disable SerializableStateInvariantMiddleware
          }
    ).concat(socketMiddleware),
    devTools:process.env.NODE_ENV !== "production"
});

setInterval(() => {
    store.dispatch(updateTradeTime());
  }, 1000); // Runs every second globally
  

export default store