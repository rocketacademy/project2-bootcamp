import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import "./App.css";
import AuthFormTesting from "./Components/AuthFormTesting";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PersistentDrawerLeft from "./Components/Drawer";
import { AppLinks } from "./AppMain";

// MUI
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
// import { Typography } from "@mui/material/styles/createTypography";

const libraries = ["places"];

const useLoadScriptOptions = {
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries,
};

const mapContainerStyle = {
  width: "80vw",
  height: "80vh",
};
const center = {
  lat: 1.35313, // default latitude
  lng: 103.81404, // default longitude
};

// Styling MUI function
const StyledContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
});

const StyledGridItem = styled(Grid)({
  width: "30%",
});

const StyledGridPills = styled("div")({
  width: "150px", // Define the width of your container
  height: "100px", // Define the height of your container
  marginBottom: "30px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  marginRight: "20px",
  marginLeft: "20px",
});

const App = () => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState({});

  // drawerRef holds the reference to the drawer open function from PersistentDrawerLeft component -> holds the function handleDrawerOpen from Drawer.js
  const [drawerRef, setDrawerRef] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (drawerRef) {
      drawerRef();
    }
  }, [drawerRef]); // Listening for changes to drawerRef if it contains the handleDrawerOpen method from Drawer.js

  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries,
  // });

  const { isLoaded, loadError } = useLoadScript(useLoadScriptOptions);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const sendMessage = async (targetMessage) => {
    try {
      const messageToSend = userMessage === "" ? targetMessage : userMessage;

      const response = await fetch("http://localhost:3002/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();
      setAiResponse(data.message);
      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error state here if needed
    }
  };

  const clearAIResponse = () => {
    setAiResponse("");
  };

  return (
    <Box>
      <Box>
        {isLoggedIn ? (
          <PersistentDrawerLeft
            aiResponse={aiResponse}
            clearAIResponse={clearAIResponse}
            // onDrawerOpen: the function to set drawerRef state is passed as argument to onDrawerOpen
            onDrawerOpen={(func) => setDrawerRef(func)}
            sendMessage={sendMessage}
          />
        ) : (
          <AuthFormTesting />
        )}

        {isLoggedIn && (
          <StyledContainer>
            <StyledGridItem item>
              {/* <h2>Welcome back {user.email}</h2> */}
              <AppLinks />
            </StyledGridItem>
            <StyledGridPills item>
              <Button
                variant="outlined"
                onClick={() => {
                  const message = "Singapore Flyer in 1 sentence";
                  sendMessage(message);
                }}
                sx={{ width: "150px", height: "50px" }}
              >
                Singapore Flyer
              </Button>
            </StyledGridPills>
            <StyledGridPills item>
              <Button
                variant="outlined"
                onClick={() => {
                  const message = "Sentosa Island in 1 sentence";
                  sendMessage(message);
                }}
                sx={{ width: "150px", height: "50px" }}
              >
                Sentosa Island
              </Button>
            </StyledGridPills>
            <StyledGridPills item>
              <Button
                variant="outlined"
                onClick={() => {
                  const message = "Chinatown Singapore in 1 sentence";
                  sendMessage(message);
                }}
                sx={{ width: "150px", height: "50px" }}
              >
                Chinatown
              </Button>
            </StyledGridPills>
          </StyledContainer>
        )}
      </Box>

      {isLoggedIn && (
        <StyledContainer>
          <StyledGridItem item sx={{ margin: "20px" }}>
            {/* <TextField
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{ mt: "20px", mb: "20px" }}
            >
              Send Message
            </Button> */}
          </StyledGridItem>
          <StyledGridItem
            item
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              mapId="6da2495ffc989dca"
              zoom={12}
              center={center}
            >
              <Marker position={center} />
              <Marker
                position={{ lat: 1.40058, lng: 103.90899 }}
                onClick={() => {
                  const lat = 1.40058;
                  const lng = 103.90899;
                  console.log("Marker clicked!");
                  console.log(lat);
                  console.log(lng);
                  const message = `What is the name of this location with the following address: 100 Punggol Central, Singapore 828839. Share with me its history, and what developments occured in the last 20 years in Singapore. Word limit is 30 words.`;
                  sendMessage(message);
                }}
              />
            </GoogleMap>
          </StyledGridItem>
        </StyledContainer>
      )}

      <Box style={{ display: isLoggedIn ? "none" : "block" }}>
        {!isLoggedIn && <AuthFormTesting />}
      </Box>
    </Box>
  );
};

export default App;

/** opening of drawer when sendMessage is called:
  1. onDrawerOpen={(func)=> setDrawerRef(func)} is passed as a prop into PersistentDrawerLeft and sets up drawerRef with the handleDrawerOpen when app renders for the first time

  2. When sendMessage is invoked, it updates aiResponse and clears userMessage, triggering a re-render of App component

  3. The re-render of the entire App component causes the useEffect() for drawerRef to run and calls the handleDrawerOpen via drawerRef()
 */
