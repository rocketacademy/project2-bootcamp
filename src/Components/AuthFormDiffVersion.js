import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { useState } from "react";
import { auth } from "../firebase";
import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetPasswordTimer, setResetPasswordTimer] = useState(true);

  const signUp = async () => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
  };

  const persistAuthState = () => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const forgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Email sent");
        // setResetPasswordTimer(false);
        // setTimeout(5000);
        // setResetPasswordTimer(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const signIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card
          sx={{
            width: 500,
          }}
        >
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center", // Add this line to center align the items
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box>
              <TextField
                margin="normal"
                required
                sx={{ width: 4 / 5 }}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                sx={{ width: 4 / 5 }}
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                onClick={persistAuthState}
              />
              {/* {!resetPasswordTimer && ( */}
              {
                <FormControlLabel
                  control={<Button value="forgot" color="secondary" />}
                  label="Forgot Password"
                  onClick={forgotPassword}
                ></FormControlLabel>
              }
              <Button
                margin="normal"
                type="submit"
                sx={{ width: 4 / 5 }}
                variant="contained"
                // sx={{ mt: 3, mb: 2 }}
                onClick={signIn}
              >
                Sign In
              </Button>
              <Button
                type="submit"
                sx={{ width: 4 / 5 }}
                variant="contained"
                // sx={{ mt: 1, mb: 1 }}
                onClick={signUp}
              >
                Sign Up
              </Button>
              <Grid container></Grid>
            </Box>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
