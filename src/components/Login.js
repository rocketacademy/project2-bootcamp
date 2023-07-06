import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, currentUser, setAlert } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      console.log("Welcome " + currentUser.email);
    }
  }, [currentUser, navigate]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // Redirect to Home after successful login
    } catch (error) {
      setAlert({
        isAlert: true,
        severity: "error",
        message: error.message,
        timeout: 5000,
        location: "page",
      });
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/"); // Redirect to Home after successful login
    } catch (error) {
      console.log("Google login error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign In
          </Button>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In With Google
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
