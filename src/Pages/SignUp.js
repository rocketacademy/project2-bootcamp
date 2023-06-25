import "../App.css";
import React, { useState } from "react";
import { realTimeDatabase, storage, auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const DB_USER_FOLDER_NAME = "user";
const STORAGE_PROFILE_FOLDER_NAME = "profilePhoto";

export default function SignUp({
  isLoggedIn,
  fileInputFile,
  setFileInputFile,
  fileInputValue,
  setFileInputValue,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState(false);

  const signUp = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      // Check if the email is already in use
      fetchSignInMethodsForEmail(auth, email)
        .then((signInMethods) => {
          if (signInMethods.length > 0) {
            // Email is already in use
            console.log("Email is already in use");
            setValidationError(true);
          } else {
            // Email is valid and not in use
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                const userRef = ref(
                  realTimeDatabase,
                  `${DB_USER_FOLDER_NAME}/${userCredential.user.uid}`
                );
                set(userRef, {
                  firstName: firstName,
                  lastName: lastName,
                  UID: userCredential.user.uid,
                  email: email,
                  displayName: displayName,
                  // set default display currency for all new users to SGD
                  displayCurrency: "SGD",
                });
                // Store images in an images folder in Firebase Storage
                const fileRef = storageRef(
                  storage,
                  ` ${STORAGE_PROFILE_FOLDER_NAME}/${userCredential.user.uid}/${fileInputFile.name}`
                );

                uploadBytes(fileRef, fileInputFile).then((snapshot) => {
                  getDownloadURL(snapshot.ref).then((profileUrl) => {
                    // update user db with profile photo url
                    const currUserRef = ref(
                      realTimeDatabase,
                      `${DB_USER_FOLDER_NAME}/${userCredential.user.uid}/profileUrl`
                    );
                    set(currUserRef, profileUrl);
                  });
                });
                navigate("/mapexpenses");
              })
              .catch((error) => {
                console.log("Error creating user:", error);
              });
          }
        })
        .catch((error) => {
          console.log("Error fetching sign-in methods:", error);
        });
      setValidated(false);
    }

    setValidated(true);
  };

  return (
    <>
      <Container
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        {" "}
        <h2>Sign Up</h2>
        <br />
        {isLoggedIn ? (
          <div>
            <h2>Welcome {displayName}</h2>
            <h5>
              Click on <Link to="/mapexpenses">MapExpenses </Link>
              to start tracking your expenses!
            </h5>
          </div>
        ) : (
          <Row>
            <Col>
              <Form noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Row>
                    <Col>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        required
                      />
                    </Col>
                    <Col>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      borderColor: validationError ? "red" : "",
                    }}
                  />
                  {validationError ? (
                    <span style={{ color: "red" }}>
                      Email is already in use
                    </span>
                  ) : (
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Upload profile photo (optional)</Form.Label>
                  <Form.Control
                    type="file"
                    value={fileInputValue}
                    onChange={(e) => {
                      setFileInputFile(e.target.files[0]);
                      setFileInputValue(e.target.value);
                    }}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={signUp}
                  style={{ width: "100%" }}
                >
                  Sign Up
                </Button>
                <div className="text-center" style={{ marginTop: "5px" }}>
                  <Link to="/authform">
                    Already have an account? Sign In here!
                  </Link>
                </div>
              </Form>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}
