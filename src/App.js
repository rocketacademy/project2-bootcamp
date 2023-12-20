import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import AuthFormTesting from "./Components/AuthFormTesting";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// MUI
import { TextField, Box } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

// class App extends React.Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//         </header>
//       </div>
//     );
//   }
// }

const App = () => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayedWords, setDisplayedWords] = useState([]);

  const [wordIndex, setWordIndex] = useState(0);

  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

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

  console.log(aiResponse, displayedWords);

  return (
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
  );
};

export default App;
