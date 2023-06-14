import "../App.css";
import React, { useState } from "react";
import { realTimeDatabase, storage, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { push, ref, set } from "firebase/database";
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

export default function SignUp({ isLoggedIn, username }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fileInputFile, setFileInputFile] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userRef = ref(
          realTimeDatabase,
          `${DB_USER_FOLDER_NAME}/${userCredential.user.uid}`
        );
        const newUserRef = push(userRef);
        set(newUserRef, {
          firstName: firstName,
          lastName: lastName,
          userId: userCredential.user.uid,
          email: email,
          displayName: displayName,
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
      })
      .catch((error) => {
        console.log("Error getting download URL:", error);
      });

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setFileInputFile("");
    setFileInputValue("");
    navigate("/mapexpenses");
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        {isLoggedIn ? (
          <div>
            <h2>Welcome {displayName}</h2>
            <h5>Click on the top navigator to start posting!</h5>
          </div>
        ) : (
          <Row>
            <Col>
              <Form>
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
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Upload profile photo</Form.Label>
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
                  type="submit"
                  onClick={signUp}
                  style={{ width: "100%" }}
                >
                  Sign Up
                </Button>
                <div className="text-center">
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
