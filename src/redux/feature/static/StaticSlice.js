import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  footballs: [],
  basketballs: [],
  volleyballs: [],
  badmintons: [],
  status: "idle",
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL.replace(/^http:/, "https:");
const endPoint = import.meta.env.VITE_ALLSPORT_URL;
const apiUrl = `${baseUrl}${endPoint}`;

export const fetchStatics = createAsyncThunk(
  "statics/fetchStatics",
  async () => {
    let allResults = [];
    let nextPage = apiUrl;

    while (nextPage) {
      nextPage = nextPage.replace(/^http:/, "https:");
      const response = await fetch(nextPage);
      const data = await response.json();
      console.log("API Response:", data);
      allResults = [...allResults, ...data.results];
      nextPage = data.next;
    }
    return allResults;
  }
);

export const staticsSlice = createSlice({
  name: "statics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatics.fulfilled, (state, action) => {
        state.status = "success";
        state.footballs = action.payload.filter(
          (item) => item.sport_category_name === "football"
        );
        state.basketballs = action.payload.filter(
          (item) => item.sport_category_name === "basketball"
        );
        state.volleyballs = action.payload.filter(
          (item) => item.sport_category_name === "volleyball"
        );
        state.badmintons = action.payload.filter(
          (item) => item.sport_category_name === "badminton"
        );
      })
      .addCase(fetchStatics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default staticsSlice.reducer;

export const selectAllFootballs = (state) => state.static.footballs;
export const selectAllBasketballs = (state) => state.static.basketballs;
export const selectAllVolleyballs = (state) => state.static.volleyballs;
export const selectAllBadmintons = (state) => state.static.badmintons;
