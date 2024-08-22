import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const usersEndPoint = import.meta.env.VITE_ALLUSER_URL;
const apiUrl = `${baseUrl}${usersEndPoint}`;

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response.data.count);
    }
  }
);

// User slice
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectUsers = (state) => state.user.users;

export default userSlice.reducer;
