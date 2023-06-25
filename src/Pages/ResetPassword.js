import React, { useState } from "react";
import { auth } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./App.css";

export default PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setResetSent(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="temporary-box">
      <h2>Password Reset</h2>
      {resetSent ? (
        <p>A password reset link has been sent to your email address.</p>
      ) : (
        <Form onSumit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <Button type="submit">Reset Password</Button>
          {error && <p>{error}</p>}
        </Form>
      )}
    </div>
  );
};
