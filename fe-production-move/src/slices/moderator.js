import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import ModeratorService from "../services/moderator.service";
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, role }, thunkAPI) => {
    try {
      const response = await ModeratorService.register(
        username,
        email,
        password,
        role
      );
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

const authSlice = createSlice({
  name: "moderator",
  initialState,
  extraReducers: {},
});

const { reducer } = authSlice;
export default reducer;
