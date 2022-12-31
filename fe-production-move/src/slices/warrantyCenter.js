import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";

import warrantyCenterService from "../services/warranty.center.service";
export const clickStatisticsProductButton = createAsyncThunk(
  "warrantyCenter/product",
  async ({ statusId, month, quarter, year }, thunkAPI) => {
    try {
      const response = await warrantyCenterService.getStatisticInData(
        statusId,
        month,
        quarter,
        year
      );
      thunkAPI.dispatch(setMessage(response.data.message));
      console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].key = response.data[i].id;
      }
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue([]);
    }
  }
);
const initialState = { dataTableStatistic: [] };
const authSlice = createSlice({
  name: "warrantyCenter",
  initialState,
  extraReducers: {
    [clickStatisticsProductButton.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.dataTableStatistic = action.payload;
    },
    [clickStatisticsProductButton.rejected]: (state, action) => {
      console.log(action.payload);
      state.dataTableStatistic = action.payload;
    },
  },
});

const { reducer } = authSlice;
export default reducer;
