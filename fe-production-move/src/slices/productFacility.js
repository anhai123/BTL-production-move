import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import facilityService from "../services/product.facility.service";

export const clickStatisticsProductButton = createAsyncThunk(
  "productFacility/product",
  async ({ statusId, month, quarter, year }, thunkAPI) => {
    try {
      const response = await facilityService.ProductStatisticData(
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

export const clickStatisticsProductButton2 = createAsyncThunk(
  "productFacility/product2",
  async ({ id_co_so_sx, id_dai_ly, id_danh_muc_sp }, thunkAPI) => {
    try {
      const response = await facilityService.ProductStatisticRatioNumber(
        id_danh_muc_sp,
        id_co_so_sx,
        id_dai_ly
      );
      return response.data.result;
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
const initialState = { dataTableStatistic: [], dataTableStatistic2: "" };
const authSlice = createSlice({
  name: "productFacility",
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

    [clickStatisticsProductButton2.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.dataTableStatistic2 = action.payload;
    },
    [clickStatisticsProductButton2.rejected]: (state, action) => {
      console.log(action.payload);
      state.dataTableStatistic2 = action.payload;
    },
  },
});

const { reducer } = authSlice;
export default reducer;
