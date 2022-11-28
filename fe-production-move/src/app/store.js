import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slices/message";
import authReducer from "../slices/auth";

const reducer = {
  auth: authReducer,
  message: messageReducer,
};
const store = configureStore({
  reducer: reducer,
  devTools: true,
});
export default store;
