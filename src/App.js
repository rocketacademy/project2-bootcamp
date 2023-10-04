//-----------React-----------//
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//-----------Pages-----------//
import HomePage from "./Pages/HomePage";
import Onboarding from "./Pages/OnboardingPage";
import SignUpPage from "./Pages/SignUpPage";
import SignInPage from "./Pages/SignInPage";
import SettingsPage from "./Pages/SettingsPage";
import ChatPage from "./Pages/ChatPage";
import BucketList from "./Pages/BucketListPage";
import FeedPage from "./Pages/FeedPage";
import DatesPage from "./Pages/DatesPage";
import ErrorPage from "./Pages/ErrorPage";

//-----------Firebase-----------//

//-----------Styling-----------//
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/feed",
    element: <FeedPage />,
  },
  {
    path: "/dates",
    element: <DatesPage />,
  },
  {
    path: "/bucket-list",
    element: <BucketList />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
