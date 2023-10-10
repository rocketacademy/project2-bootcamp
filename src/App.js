//-----------React-----------//
import React from "react";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//-----------Pages-----------//
import HomePage from "./Pages/HomePage";
import Onboarding from "./Pages/OnboardingPage";
import SignUpPage from "./Pages/SignUpPage";
import PairUp from "./Pages/PairUpPage";
import SignInPage from "./Pages/SignInPage";
import SettingsPage from "./Pages/SettingsPage";
import ChatPage from "./Pages/ChatPage";
import BucketList from "./Pages/BucketListPage";
import FeedPage from "./Pages/FeedPage";
import DatesPage from "./Pages/DatesPage";
import ErrorPage from "./Pages/ErrorPage";
import BucketForm from "./Components/BucketForm";

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
    path: "/pair-up",
    element: <PairUp />,
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
    path: "/memories",
    element: <FeedPage />,
  },
  {
    path: "/dates",
    element: <DatesPage />,
  },
  {
    path: "/bucket-list",
    element: (
      <BucketList>
        <BucketForm />
      </BucketList>
    ),
  },
]);

export const UserContext = React.createContext(null);

function App() {
  const [pairKey, setPairKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPairedUp, setIsPairedUp] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const user = {
    pairKey,
    isLoggedIn,
    isPairedUp,
    isDemo,
    setPairKey,
    setIsLoggedIn,
    setIsPairedUp,
    setIsDemo,
  };

  return (
    <UserContext.Provider value={user}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
