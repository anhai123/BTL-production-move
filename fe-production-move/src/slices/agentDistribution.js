import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import DistributionAgentServices from "../services/distributionAgent.service";
export const clickStatisticsProductButton = createAsyncThunk(
  "distributionAgent/product",
  async ({ statusId, month, quarter, year }, thunkAPI) => {
    try {
      const response = await DistributionAgentServices.ProductStatisticData(
        statusId,
        month,
        quarter,
        year
      );

      console.log(response.data);

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
const handelQuarterDataTable = (arr, year) => {
  let dataTable = [];

  let year1 = year - 2;
  for (let i = 0; i < 12; i += 4) {
    let children = [];
    let count = 1;
    for (let j = i; j < i + 4; j++) {
      children.push({
        key: i + 100 * (j + 1),
        year: count,
        so_luong: arr[j],
      });
      count++;
    }
    dataTable.push({
      key: i,
      year: year1,
      so_luong: null,
      children: children,
    });
    year1 = year1 + 1;
  }

  return dataTable;
};
export const clickStatisticsProductButton2 = createAsyncThunk(
  "distributionAgent/product2",
  async ({ statistic_type_value, year, thunkAPI }) => {
    try {
      const response = await DistributionAgentServices.ProductStatisticNumber(
        statistic_type_value,
        year
      );

      console.log(response.data);

      let dataTable = [];
      if (statistic_type_value === "month") {
        for (let i = 0; i < response.data.length; i++) {
          dataTable.push({
            key: i,
            month: i + 1,
            so_luong: response.data[i],
          });
        }
      } else if (statistic_type_value === "year") {
        let year1 = year;
        for (let i = response.data.length - 1; i >= 0; i--) {
          dataTable.push({
            key: i,
            year: year1,
            so_luong: response.data[i],
          });
          year1 = year1 - 1;
        }
      } else if (statistic_type_value === "quarter") {
        dataTable = handelQuarterDataTable(response.data, year);
      }
      console.log(dataTable);
      return dataTable;
    } catch (error) {
      console.log(error);
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
const initialState = {
  dataTableStatistic: [],
  dataTableStatistic2: [],
  statisticType: "",
};
const authSlice = createSlice({
  name: "distributionAgent",
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
