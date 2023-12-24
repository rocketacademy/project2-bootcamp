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
import { TextField, Box } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { mapToStyles } from "@popperjs/core/lib/modifiers/computeStyles";
import { assertExpressionStatement } from "@babel/types";

const libraries = ["places"];
// const axios = require("axios");

const App = () => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayedWords, setDisplayedWords] = useState([]);

  const [wordIndex, setWordIndex] = useState(0);

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

  console.log(aiResponse, displayedWords);

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
    <div>
      <Box className="App">
        <Grid container direction="column" alignItems="left" spacing={2}>
          {isLoggedIn && (
            <Grid item>
              <Box>
                <h2>Welcome back {user.email}</h2>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    setIsLoggedIn(false);
                    signOut(auth);
                    setUser({});
                  }}
                >
                  Log out
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item>
            {isLoggedIn && (
              <>
                <TextField
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                />
                <Button variant="contained" onClick={sendMessage}>
                  Send Message
                </Button>

                <Box marginTop={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const message = "Singapore Flyer in 1 sentence";
                      sendMessage(message);
                    }}
                  >
                    Singapore Flyer
                  </Button>
                </Box>
                <Box marginTop={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const message = "Singapore Esplanade in 1 sentence";
                      sendMessage(message);
                    }}
                  >
                    Esplanade
                  </Button>
                </Box>

                <Box className="ai-response">
                  <p>AI Response:</p>
                  <p>{aiResponse}</p>
                </Box>
                <GoogleMap
                  id="map"
                  mapContainerStyle={{
                    width: "100vw",
                    height: "100vh",
                  }}
                  zoom={12}
                  center={{ lat: 1.3521, lng: 103.8198 }}
                  onClick={onMapClick}
                  onLoad={onMapLoad}
                >
                  {selectedLocation && (
                    <InfoWindow
                      position={{
                        lat: selectedLocation.lat,
                        lng: selectedLocation.lng,
                      }}
                      onCloseClick={() => setSelectedLocation(null)}
                    >
                      <div>
                        <h2>Clicked location</h2>
                        <p>Lat: {selectedLocation.lat}</p>
                        <p>Lng: {selectedLocation.lng}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
                {/* <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  mapId="6da2495ffc989dca"
                  zoom={12}
                  center={center}
                >
                  <Marker position={center} />
                  <Marker
                    onClick={() => {
                      // const lat = 1.40058;
                      // const lng = 103.90899;
                      
                      console.log("Marker clicked!");
                      console.log(lat);
                      console.log(lng);
                      const message = `What is the name of this location with the following address: 100 Punggol Central, Singapore 828839. Share with me its history, and what developments occured in the last 20 years in Singapore. Word limit is 30 words.`;
                      sendMessage(message);
                    }}
                  />
                </GoogleMap> */}
                <Box>
                  {displayedWords.map((word, index) => (
                    <span key={index}>{word}&nbsp;</span>
                  ))}
                </Box>
              </>
            )}

            <Box style={{ display: isLoggedIn ? "none" : "block" }}>
              {!isLoggedIn && <AuthFormTesting />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default App;
