import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";

// Pages
import Trades from "./pages/Trades.js";
import Settings from "./pages/Settings.js";
import Insights from "./pages/Insights";
import App from "./App";
import AuthPortal from "./pages/AuthPortal.js";

import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import PrivateRoute from "./components/PrivateRoute.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPortal />,
  },
  {
    path: "/dash",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
  {
    path: "/trades",
    element: (
      <PrivateRoute>
        <Trades />
      </PrivateRoute>
    ),
  },

  {
    path: "/insights",
    element: (
      <PrivateRoute>
        <Insights />
      </PrivateRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
