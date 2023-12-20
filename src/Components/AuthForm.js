import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
  };

  const signIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          Sign In / Sign Up
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Here"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password Here"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button variant="contained" fullWidth onClick={signIn}>
          Sign In
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button variant="contained" fullWidth onClick={signUp}>
          Sign Up
        </Button>
      </Grid>
    </Grid>

    // <div>
    //   <label>Email</label>
    //   <br />
    //   <input
    //     type="text"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     placeholder="Email Here"
    //   />
    //   <br />
    //   <input
    //     type="text"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //     placeholder="Password Here"
    //   />
    //   <br />

    //   <button onClick={signUp}>Sign up</button>
    //   <button onClick={signIn}>Sign in</button>
    // </div>
  );
}
