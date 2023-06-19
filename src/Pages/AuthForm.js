import "../App.css";
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function AuthForm({ isLoggedIn, username }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/mapexpenses");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // alert(errorCode);
        if (errorCode === "auth/user-not-found") {
          alert("Oops! Invalid email address. ");
        } else if (errorCode === "auth/wrong-password") {
          alert("Oops! Invalid password.");
        }
      });
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        {isLoggedIn ? (
          <div>
            <h2>Welcome </h2>
            <h5>Click on the top navigator to start posting!</h5>
          </div>
        ) : (
          <Row>
            <Col>
              <Form>
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

                <Button
                  variant="primary"
                  onClick={signIn}
                  style={{ width: "100%" }}
                >
                  Sign In
                </Button>
                <div className="text-center" style={{ marginTop: "5px" }}>
                  <Link to="/signUp">
                    Don't have an account? Create one here!
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
