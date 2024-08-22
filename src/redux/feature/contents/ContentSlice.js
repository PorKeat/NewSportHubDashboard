import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  contents: [],
  status: "idle",
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;
const endPoint = import.meta.env.VITE_ALLCONTENT_URL;
const apiUrl = `${baseUrl}${endPoint}`;

export const fetchContents = createAsyncThunk("contents/fetchContents", async () => {
  const response = await fetch(apiUrl);
  const allContent = await response.json();
  const count = allContent.data.length;
  // ? Compare to filter
  // const count = allContent.data.filter(item => item.content_type === "news");
  return count;
});

export const contentsSlice = createSlice({
  name: "contents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        (state.status = "success"), (state.contents = action.payload);
      })
      .addCase(fetchContents.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.error.message);
      });
  },
});

export default contentsSlice.reducer;
export const selectAllContents = (state) => state.content.contents;
