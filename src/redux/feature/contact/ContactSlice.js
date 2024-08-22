import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  status: "idle",
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;
const endPoint = import.meta.env.VITE_ALLSPORT_URL;
const apiUrl = `${baseUrl}${endPoint}`;

const counts = {
  facebook: 0,
  twitter: 0,
  instagram: 0,
  telegram: 0,
  website: 0,
  first_phone: 0,
  second_phone: 0,
  email: 0,
};

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();

    for (const event of data.results) {
      const contactInfo = event.contact_info;

      for (const [key, value] of Object.entries(contactInfo)) {
        if (key in counts && value) {
          counts[key]++;
        }
      }
    }

    return counts;
  }
);

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        (state.status = "success"), (state.contacts = action.payload);
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.error.message);
      });
  },
});

export default contactsSlice.reducer;
export const selectAllContacts = (state) => state.contact.contacts;
