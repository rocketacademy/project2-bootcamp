//-----------React-----------//
import React from "react";
import { useState, useEffect } from "react";
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
import JournalPage from "./Pages/JournalPage";
import Spare from "./Pages/Spare";

//-----------Firebase-----------//
import { auth, database } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, orderByChild, query, equalTo, get } from "firebase/database";

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
    path: "/spare",
    element: <Spare />,
  },
  {
    path: "/bucket-list",
    element: <BucketList />,
  },
  {
    path: "/journal",
    element: <JournalPage />,
  },
]);

export const UserContext = React.createContext(null);

function App() {
  const [pairKey, setPairKey] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPairedUp, setIsPairedUp] = useState(false);
  const [email, setEmail] = useState("");

  const context = {
    email,
    displayName,
    pairKey,
    isLoggedIn,
    isPairedUp,
    setEmail,
    setDisplayName,
    setPairKey,
    setIsLoggedIn,
    setIsPairedUp,
  };
  // Pull user email from Auth & set login state
  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        fetchPairKey(userInfo.email);
        setEmail(userInfo.email);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  // Pull pairkey data from userRef db in Firebase database
  const fetchPairKey = async (userEmail) => {
    const userRef = ref(database, "userRef");
    const emailQuery = query(
      userRef,
      orderByChild("email"),
      equalTo(userEmail),
    );

    try {
      const snapshot = await get(emailQuery);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userKey = Object.keys(userData)[0];
        const pairKey = userData[userKey].pairKey;
        const displayName = userData[userKey].displayName;
        setDisplayName(displayName);
        setPairKey(pairKey);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <UserContext.Provider value={context}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
