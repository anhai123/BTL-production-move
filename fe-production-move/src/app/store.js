import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slices/message";
import authReducer from "../slices/auth";
import moderatorReducer from "../slices/moderator";
import agentDistributionReducer from "../slices/agentDistribution";
import facilityReducer from "../slices/productFacility";
import warrantyReducer from "../slices/warrantyCenter";
const reducer = {
  auth: authReducer,
  message: messageReducer,
  moderator: moderatorReducer,
  distributionAgent: agentDistributionReducer,
  facility: facilityReducer,
  warranty: warrantyReducer,
};
const store = configureStore({
  reducer: reducer,
  devTools: true,
});
export default store;
