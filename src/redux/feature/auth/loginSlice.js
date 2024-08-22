import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeAccessToken,
  removeAccessToken,
  getAccessToken,
  storeRole,
  removeRole,
  getRole,
  storeUser,
  removeUser,
  getUser,
} from "../../../lib/secureLocalStorage";

const baseUrl = import.meta.env.VITE_BASE_URL;
const loginEndPoint = import.meta.env.VITE_LOGIN_URL;
const profileEndPoint = import.meta.env.VITE_PROFILE_URL;
const apiUrl = `${baseUrl}${loginEndPoint}`;
const profileUrl = `${baseUrl}${profileEndPoint}`;

const initialState = {
  status: "idle",
  error: null,
  accessToken: getAccessToken(),
  role: getRole(),
  username: null,
  email: null,
  profile: null,
};

export const fetchLogin = createAsyncThunk(
  "admin/fetchLogin",
  async ({ email, password }) => {
    const body = JSON.stringify({ email, password });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const loginData = await response.json();
    const accessToken = loginData.access;

    const profileResponse = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch profile");
    }

    const profileData = await profileResponse.json();

    const role = profileData.role.name;
    const username = profileData.username;
    const emailData = profileData.email;
    const profile = profileData.profile_image;

    if (role === "admin" || role === "editor") {
      return { accessToken, role, username, emailData, profile };
    } else {
      throw new Error("Unauthorized role");
    }
  }
);

const loginSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      removeAccessToken();
      removeRole();
      removeUser();
      state.accessToken = null;
      state.role = null;
      state.username = null;
      state.email = null;
      state.profile_image = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { accessToken, role, username, emailData, profile } =
          action.payload;
        storeAccessToken(accessToken);
        storeRole(role);
        storeUser(username, emailData, profile);
        state.accessToken = accessToken;
        state.role = role;
        state.username = username;
        state.email = emailData;
        state.profile_image = profile;
      })
      .addCase(fetchLogin.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to login";
      });
  },
});

export default loginSlice.reducer;

export const { logout } = loginSlice.actions;
// export const selectAccessToken = (state) => state.login.accessToken;
// export const selectRole = (state) => state.login.role;
// export const selectUsername = (state) => state.login.username;
// export const selectEmail = (state) => state.login.email;
