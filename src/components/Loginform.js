import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config";

const Login = () => {
  const [inputEmail, inputEmailValue] = useState("");
  const [inputPwd, inputPwdValue] = useState("");
  const navigate = useNavigate();

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "inputEmailValue") {
      inputEmailValue(e.target.value);
    } else if (e.target.name === "inputPwdValue") {
      inputPwdValue(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logInWithEmailAndPassword(inputEmail, inputPwd)
      .then(() => {
        inputEmailValue("");
        inputPwdValue("");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  return (
    <div className="centered">
      <p style={{ textAlign: "right", fontSize: 15 }}>
        To Register an account. Click{" "}
        <Link to="/auth/register" style={{ color: "yellow" }}>
          here
        </Link>
        .
      </p>
      <h1>Login</h1>
      <h4>Login using your account</h4>
      <form className="form" onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="Email Address"
          variant="filled"
          type="email"
          name="inputEmailValue"
          value={inputEmail}
          onChange={handleChange}
          style={{ backgroundColor: "white" }}
        />
        <TextField
          label="Password"
          variant="filled"
          type="password"
          name="inputPwdValue"
          value={inputPwd}
          onChange={handleChange}
          style={{ backgroundColor: "white", fontWeight: "bolder" }}
        />
        <Button
          variant="outlined"
          type="submit"
          style={{ fontWeight: "bolder" }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
