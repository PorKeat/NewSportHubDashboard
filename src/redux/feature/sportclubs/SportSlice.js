import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  sports: [],
  status: "idle",
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;
const endPoint = import.meta.env.VITE_ALLSPORT_URL;
const apiUrl = `${baseUrl}${endPoint}`;

export const fetchSports = createAsyncThunk("sports/fetchSports", async () => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.count;
});

export const sportsSlice = createSlice({
  name: "sports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSports.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(fetchSports.fulfilled, (state, action) => {
        (state.status = "success"), (state.sports = action.payload);
      })
      .addCase(fetchSports.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.error.message);
      });
  },
});

export default sportsSlice.reducer;
export const selectAllSports = (state) => state.sportclubs.sports;
