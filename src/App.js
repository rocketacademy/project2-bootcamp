import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from "./Pages/Welcome";
import { realTimeDatabase, auth } from "./firebase";
import { ref, onValue, child, get } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import AuthForm from "./Pages/AuthForm";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import Error from "./Components/Error";
import MapExpenses from "./Pages/MapExpenses";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import patchQuestionFillSvg from "./Icons/patch-question-fill.svg";

const DB_USER_FOLDER_NAME = "user";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [uid, setUID] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [userKey, setUserKey] = useState("");
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setUID(user.uid);
        console.log("user exist" + user);

        const dbRef = ref(realTimeDatabase);
        get(child(dbRef, `${DB_USER_FOLDER_NAME}/${uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                const userKey = childSnapshot.key; // Retrieve the key of each child node
                const userData = childSnapshot.val(); // Retrieve the data of each child node
                console.log("User Key:", userKey);
                console.log("User Data:", userData);
                const requiredUserData = {
                  ["Display Name"]: userData.displayName,
                  ["First Name"]: userData.firstName,
                  ["Last Name"]: userData.lastName,
                  ["Email"]: userData.email,
                };
                setUserData(requiredUserData); //only take those required
                setUserKey(userKey);

                // use uid to find profile url
                const profilePhotoRef = ref(
                  realTimeDatabase,
                  `${DB_USER_FOLDER_NAME}/${uid}/${userKey}/profileUrl`
                );

                onValue(profilePhotoRef, (snapshot) => {
                  setProfilePhotoURL(snapshot.val());
                });
              });
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setIsLoggedIn(false);
        setUser({});
        setUID("");
        setProfilePhotoURL("");
      }
    });
  }, [uid]);

  console.log(`isLoggedIn: ${isLoggedIn}`);
  console.log(user);
  console.log(`uid: ${uid}`);
  console.log(`profilePhotoURL: ${profilePhotoURL}`);
  return (
    <>
      <Navbar bg="light" fixed="top">
        <Container
          style={{
            maxWidth: "1025px",
            paddingLeft: "0",
            paddingRight: "0",
          }}
        >
          <Container>
            <Navbar.Brand href="#home">
              <img
                alt="Money Stack Emoji"
                src="https://em-content.zobj.net/thumbs/240/apple/354/dollar-banknote_1f4b5.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              Dollar Direction
            </Navbar.Brand>
          </Container>
          <Container className="navbar-home-container">
            <Nav>
              <Nav.Link as={Link} to="/mapexpenses">
                Home
              </Nav.Link>
              {uid ? (
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
              ) : null}
              <NavDropdown
                title={
                  profilePhotoURL ? (
                    <img
                      class="rounded-circle"
                      src={profilePhotoURL}
                      alt="user"
                      width="30"
                      height="30"
                    />
                  ) : (
                    <img
                      src={patchQuestionFillSvg}
                      alt="user"
                      width="30"
                      height="30"
                    />
                  )
                }
                id="basic-nav-dropdown"
              >
                {isLoggedIn ? (
                  <>
                    <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsLoggedIn(false);
                        signOut(auth);
                        setUser({});
                        setProfilePhotoURL("");
                        setUID("");
                        navigate("/mapexpenses");
                      }}
                    >
                      Log Out
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item href="/authform">
                      Sign In
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/signup">Sign Up</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Container>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Welcome isLoggedIn={isLoggedIn} />} />
        <Route
          path="/mapexpenses"
          element={<MapExpenses isLoggedIn={isLoggedIn} uid={uid} />}
        />
        <Route
          path="/profile"
          element={
            <Profile userData={userData} profilePhotoURL={profilePhotoURL} />
          }
        />
        <Route
          path="/dashboard"
          element={<Dashboard isLoggedIn={isLoggedIn} uid={uid} />}
        />
        <Route path="/signup" element={<SignUp isLoggedIn={isLoggedIn} />} />
        <Route
          path="/authform"
          element={<AuthForm isLoggedIn={isLoggedIn} />}
        />
        <Route path="*" element={<Error />} />
      </Routes>
      ;
    </>
  );
}
