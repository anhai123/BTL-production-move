import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import ModeratorService from "../services/moderator.service";
export const clickStatisticsProductButton = createAsyncThunk(
  "moderator/product",
  async (
    { id_trang_thai, id_co_so_sx, id_dai_ly, id_trung_tam_bh },
    thunkAPI
  ) => {
    try {
      const response = await ModeratorService.clickStatisticsProductButton(
        id_trang_thai,
        id_co_so_sx,
        id_dai_ly,
        id_trung_tam_bh
      );
      thunkAPI.dispatch(setMessage(response.data.message));
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
const initialState = { dataTableStatistic: [] };
const authSlice = createSlice({
  name: "moderator",
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
