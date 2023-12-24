import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import AuthFormTesting from "./Components/AuthFormTesting";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

// MUI
import { TextField, Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
// import { Typography } from "@mui/material/styles/createTypography";
import MenuItem from "@mui/material/MenuItem";
import { mapToStyles } from "@popperjs/core/lib/modifiers/computeStyles";
import { assertExpressionStatement } from "@babel/types";

const axios = require('axios');
const libraries = ["places"];
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

// SelectTextFields MUI
const landmarks = [
  {
    value: "Singapore Zoo",
    label: "Singapore Zoo",
  },
  {
    value: "Singapore Flyer",
    label: "Singapore Flyer",
  },
  {
    value: "Sentosa",
    label: "Sentosa",
  },
];

const App = () => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState("Singapore Zoo");

  const [user, setUser] = useState({});
  //Authentication Handling
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

  //Function to call OpenAI API
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
      console.log(data.message);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error state here if needed
    }
  };

  const clearAIResponse = () => {
    setAiResponse("");
  };

  console.log(aiResponse);

  //Rendering of Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const onMapClick = useCallback((event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latLng.lat()},${event.latLng.lng()}
        &key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY},
        result_type=street_address
        `
      )
      //Parse reversed geocode API response to OpenAI
      .then((res) => console.log(res))
      .then((res) =>
        sendMessage(
          `What is the name of this location with the following address:${res}. Share with me its history, and what developments occured in the last 20 years in Singapore. Word limit is 30 words.`
        )
      );
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <Box>
      <Box>
        {isLoggedIn && (
          <StyledContainer>
            <StyledGridItem item>
              <Typography
                variant="h4"
                sx={{ fontFamily: "Comic Sans MS", color: "primary.main" }}
              >
                Merlion Landmarks
              </Typography>
              <h2>Welcome back {user.email}</h2>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setIsLoggedIn(false);
                  signOut(auth);
                  setUser({});
                }}
                sx={{ marginLeft: "20px" }}
              >
                Log out
              </Button>
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

      {/* <Grid item className="LMFAO"> */}
      {isLoggedIn && (
        <StyledContainer>
          <StyledGridItem item sx={{ margin: "20px" }}>
            <TextField
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
            </Button>

            <Box className="ai-response">
              <Typography
                variant="h4"
                sx={{ fontFamily: "Comic Sans MS", color: "primary.main" }}
              >
                AI Response:
              </Typography>
              <p>{aiResponse}</p>
            </Box>
            <Button
              variant="contained"
              onClick={clearAIResponse}
              sx={{ mt: "20px", mb: "20px" }}
            >
              Clear
            </Button>
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
            >
              <TextField
                select
                label="Select"
                value={selectedLandmark}
                onChange={(e) => setSelectedLandmark(e.target.value)}
                helperText="Please select landmark"
                sx={{ display: "block" }}
              >
                {landmarks.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
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
            {/*<GoogleMap
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
            </GoogleMap>*/}
          </StyledGridItem>
        </StyledContainer>
      )}
      {/* </Grid> */}

      <Box style={{ display: isLoggedIn ? "none" : "block" }}>
        {!isLoggedIn && <AuthFormTesting />}
      </Box>
    </Box>
  );
};

export default App;
