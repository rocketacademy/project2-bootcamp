import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";
import "./Signupform.css";
import {
  child,
  ref as databaseRef,
  set,
  orderByChild,
  equalTo,
  query,
  onValue,
  get,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { database, auth, googleProvider, storage } from "../config";
import PropTypes from "prop-types";

const REALTIME_DATABASE_USERS_KEY = "Users";
const STORAGE_KEY = "images/";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const Signup = () => {
  const [nameInputValue, setNameInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [confirmPwdInputValue, setConfirmInputValue] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);

  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    //console.log(progresspercent);
  });

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const usersCollection = databaseRef(
        database,
        REALTIME_DATABASE_USERS_KEY
      );

      get(usersCollection)
        .then((snapshot) => {
          if (snapshot.exists()) {
            //Check for empty database
            const usersWithMatchingEmailQuery = query(
              usersCollection,
              orderByChild(`email`),
              equalTo(user.email)
            );

            onValue(
              usersWithMatchingEmailQuery,
              (snapshot) => {
                if (snapshot.exists()) {
                  snapshot.forEach((childSnapshot) => {
                    //const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    console.log(childData);
                    navigate("/");
                    // ...
                  });
                } else {
                  const newUsersRef = child(usersCollection, user.uid);
                  //const newUsersRef = push(usersCollection);

                  set(newUsersRef, {
                    name: user.displayName,
                    authProvider: "google",
                    email: user.email,
                    avatar: user.photoURL,
                  });

                  navigate("/");
                }
              },
              {
                onlyOnce: true,
              }
            );
          } else {
            const newUsersRef = child(usersCollection, user.uid);
            //const newUsersRef = push(usersCollection);

            set(newUsersRef, {
              name: user.displayName,
              authProvider: "google",
              email: user.email,
              avatar: user.photoURL,
            });

            navigate("/");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password, url) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const usersCollection = databaseRef(
        database,
        REALTIME_DATABASE_USERS_KEY
      );

      const newUsersRef = child(usersCollection, user.uid);
      set(newUsersRef, {
        name: name,
        authProvider: "local",
        email: email,
        avatar: url,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleChange = (event) => {
    if (event.target.name === "emailInputValue") {
      setEmailInputValue(event.target.value);
    } else if (event.target.name === "nameInputValue") {
      setNameInputValue(event.target.value);
    } else if (event.target.name === "passwordInputValue") {
      setPasswordInputValue(event.target.value);
    } else if (event.target.name === "confirmPassword") {
      setConfirmInputValue(event.target.value);
    } else if (event.target.name === "fileInput") {
      setFileInputFile(event.target.files[0]);
      setFileInputValue(event.target.file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const originalInputState = () => {
      // Reset auth form state
      setEmailInputValue("");
      setPasswordInputValue("");
      setConfirmInputValue("");
      setErrorCode("");
      setErrorMessage("");
      setFileInputFile(null);
      setFileInputValue("");
    };

    const setErrorState = (error) => {
      setErrorCode(error.code);
      setErrorMessage(error.message);
      alert(`${errorCode} : ${errorMessage}`);
    };

    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + fileInputFile.name
    );

    const uploadTask = uploadBytesResumable(fullStorageRef, fileInputFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          if (passwordInputValue === confirmPwdInputValue) {
            registerWithEmailAndPassword(
              nameInputValue,
              emailInputValue,
              passwordInputValue,
              downloadURL
            )
              .then(() => {
                alert("Account created with email and password.");
                originalInputState();
                navigate("/");
              })
              .catch(setErrorState);
          } else {
            alert("Passwords do not match.");
          }
        });
      }
    );
  };

  return (
    <div className="centered">
      <p style={{ textAlign: "right", fontSize: 15 }}>
        Already have an account ? Click{" "}
        <Link to="/auth/login" style={{ color: "yellow" }}>
          here
        </Link>
        .
      </p>
      <h1>Sign up</h1>
      <p style={{ paddingBottom: 20, fontSize: 20 }}>
        Sign in using your google account
      </p>

      <Button
        variant="contained"
        style={{ marginLeft: "6%", width: "88%", height: 50 }}
        startIcon={<GoogleIcon />}
        onClick={() => signInWithGoogle()}
      >
        Sign in with Google
      </Button>

      <h4 style={{ paddingTop: 35, fontSize: 20 }}>
        Or sign up with your email
      </h4>
      <form className="form" onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="Display Name"
          variant="filled"
          type="text"
          name="nameInputValue"
          value={nameInputValue}
          onChange={handleChange}
          style={{ backgroundColor: "white", fontWeight: "bolder" }}
        />
        <TextField
          label="Email Address"
          variant="filled"
          type="email"
          name="emailInputValue"
          value={emailInputValue}
          onChange={handleChange}
          style={{ backgroundColor: "white", fontWeight: "bolder" }}
        />
        <TextField
          label="Password"
          variant="filled"
          type="password"
          name="passwordInputValue"
          value={passwordInputValue}
          onChange={handleChange}
          style={{ backgroundColor: "white", fontWeight: "bolder" }}
        />
        <TextField
          label="Repeat password"
          variant="filled"
          type="password"
          name="confirmPassword"
          value={confirmPwdInputValue}
          onChange={handleChange}
          style={{ backgroundColor: "white", fontWeight: "bolder" }}
        />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control
            type="file"
            name="fileInput"
            value={fileInputValue}
            onChange={handleChange}
          />
        </Form.Group>
        {progresspercent > 0 && (
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={progresspercent} />
          </Box>
        )}
        <Button
          variant="outlined"
          type="submit"
          style={{ fontWeight: "bolder" }}
        >
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default Signup;
