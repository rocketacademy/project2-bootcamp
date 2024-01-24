import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";

const AuthForm = (props) => {
  const [emailInputField, setEmailInputField] = useState("");
  const [passwordInputField, setPasswordInputField] = useState("");
  const [nameInputField, setNameInputField] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      setEmailInputField("");
      setPasswordInputField("");
      setNameInputField("");
      setIsNewUser(true);
      setErrorCode("");
      setErrorMessage("");
      // Toggle auth form off after authentication
      props.toggleAuthForm();
    };

    const setErrorState = (error) => {
      setErrorCode(error.code);
      setErrorMessage(error.message);
    };

    // Authenticate user on submit
    if (isNewUser) {
      createUserWithEmailAndPassword(auth, emailInputField, passwordInputField)
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: nameInputField,
          });
          closeAuthForm();
        })
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(auth, emailInputField, passwordInputField)
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      <p>{errorCode ? `Error code: ${errorCode}` : null}</p>
      <p>{errorMessage ? `Error message: ${errorMessage}` : null}</p>
      <p>
        {isNewUser
          ? "Enter your email and password to sign up."
          : "Sign in with this form to post."}
      </p>
      <form onSubmit={handleSubmit}>
        {isNewUser && (
          <label>
            <span>Name: </span>
            <input
              type="text"
              name="nameInputValue"
              value={nameInputField}
              onChange={(event) => handleChange(event, setNameInputField)}
            />
            <span>(optional)</span>
          </label>
        )}
        <br />
        <label>
          <span>Email: </span>
          <input
            type="email"
            name="emailInputValue"
            value={emailInputField}
            onChange={(event) => handleChange(event, setEmailInputField)}
          />
        </label>
        <br />
        <label>
          <span>Password: </span>
          <input
            type="password"
            name="passwordInputValue"
            value={passwordInputField}
            onChange={(event) => handleChange(event, setPasswordInputField)}
          />
        </label>
        <br />
        <input
          type="submit"
          value={isNewUser ? "Create Account" : "Sign In"}
          // Disable form submission if email or password are empty
          disabled={!emailInputField || !passwordInputField}
        />
        <br />
        <Button variant="link" onClick={toggleNewOrReturningAuth}>
          {isNewUser
            ? "If you have an account, click here to login"
            : "If you are a new user, click here to create account"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
