import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Layout from "./components/layout/Layout.jsx";
import { Provider } from "react-redux";
import store from "../src/redux/store.js";
import { getAccessToken } from "../src/lib/secureLocalStorage";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import Static from "./page/static/Static.jsx";
import User from "./page/users/User.jsx";
import Event from "./page/events/Event.jsx";
import New from "./page/news/New.jsx";
import History from "./page/history/History.jsx";
import Athlete from "./page/athlete/Athlete.jsx";
import { SportClub } from "./page/sport-club/SportClub.jsx";
import AddClub from "./page/sport-club/AddClub.jsx";
import SignOut from "./page/sign-out/SignOut.jsx";
import UpdateSportClub from "./components/quillJs/UpdateSportClub.jsx";
import { getRole } from "../src/lib/secureLocalStorage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const accessToken = getAccessToken();
  const userRole = getRole();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/static",
        element: (
          <ProtectedRoute>
            <Static />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <User />
          </ProtectedRoute>
        ),
      },
      {
        path: "/events",
        element: (
          <ProtectedRoute>
            <Event />
          </ProtectedRoute>
        ),
      },
      {
        path: "/news",
        element: (
          <ProtectedRoute>
            <New />
          </ProtectedRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        ),
      },
      {
        path: "/athlete",
        element: (
          <ProtectedRoute>
            <Athlete />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sport-club",
        element: (
          <ProtectedRoute>
            <SportClub />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <App />,
  },
  {
    path: "/sign-out",
    element: <SignOut />,
  },
  {
    path: "/addClub",
    element: <AddClub />,
  },
  {
    path: "/updateClub",
    element: <UpdateSportClub />,
  },
  {
    path: "/unauthorized",
    element: <div>Unauthorized</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

