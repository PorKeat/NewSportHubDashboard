import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  status: "idle",
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;
const endPoint = import.meta.env.VITE_ALLEVENT_URL;
const apiUrl = `${baseUrl}${endPoint}`;

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.count;
});

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        (state.status = "success"), (state.events = action.payload);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.error.message);
      });
  },
});

export default eventsSlice.reducer;
export const selectAllEvents = (state) => state.event.events;
