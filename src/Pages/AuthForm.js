// File to contain 'AuthForm' items like user sign up, user log in
import NavBar from "../Components/NavBar";
import "../App.css";
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AuthForm({ isLoggedIn, username }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async () => {
    const user = signInWithEmailAndPassword(auth, email, password);
    navigate("/");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <NavBar />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        {isLoggedIn ? (
          <div>
            <h2>Welcome {username}</h2>
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
                  type="submit"
                  onClick={signIn}
                  style={{ width: "100%" }}
                >
                  Sign In
                </Button>
                <div className="text-center">
                  <Link to="/signUp">
                    don't have an account? Create one here!
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
