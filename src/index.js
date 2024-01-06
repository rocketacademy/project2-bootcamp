import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Appp from "./components/App.js";

// Pages
import History from "./pages/History.js";

import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
// import History from "./pages/History";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Insights from "./pages/Insights";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Appp />,
  },
  {
    path: "/dash",
    element: <App />,
  },
  { path: "/history", element: <History /> },
  { path: "/insights", element: <Insights /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
