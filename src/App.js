import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from "./Pages/Welcome";
import { realTimeDatabase, auth } from "./firebase";
import { ref, onValue, get } from "firebase/database";
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
import currencies from "./Components/Currencies";
import ResetPassword from "./Pages/ResetPassword";

const DB_USER_FOLDER_NAME = "user";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [uid, setUID] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [userData, setUserData] = useState("");
  const [fileInputFile, setFileInputFile] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  const navigate = useNavigate();
  const [currenciesList, setCurrencies] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setUID(user.uid);
        console.log("user exist" + user);

        const userDataRef = ref(
          realTimeDatabase,
          `${DB_USER_FOLDER_NAME}/${uid}`
        );
        get(userDataRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val(); // Retrieve the data of the node
              console.log("User Data:", userData);
              const requiredUserData = {
                ["Display Name"]: userData.displayName,
                ["First Name"]: userData.firstName,
                ["Last Name"]: userData.lastName,
                ["Email"]: userData.email,
                ["Display Currency"]: userData.displayCurrency,
              };
              setUserData(requiredUserData); //only take those required

              // use uid to find profile url
              const profilePhotoRef = ref(
                realTimeDatabase,
                `${DB_USER_FOLDER_NAME}/${uid}/profileUrl`
              );

              onValue(profilePhotoRef, (snapshot) => {
                if (snapshot.val() !== null) {
                  setProfilePhotoURL(snapshot.val());
                }
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

  // function + useEffect to convert currencies from array of objects to array of strings
  const currencyList = () => {
    const array = [];
    currencies.map((currency) => array.push(currency.code));
    return array;
  };

  useEffect(() => {
    setCurrencies(currencyList());
  }, []);

  console.log(`isLoggedIn: ${isLoggedIn}`);
  console.log(user);
  console.log(userData);
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
                  profilePhotoURL !== null ? (
                    <img
                      className="rounded-circle"
                      src={profilePhotoURL}
                      alt="user"
                      width="30"
                      height="30"
                    />
                  ) : (
                    <img
                      src={patchQuestionFillSvg}
                      alt=""
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
          element={
            <MapExpenses
              isLoggedIn={isLoggedIn}
              uid={uid}
              userData={userData}
              currenciesList={currenciesList}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile
              userData={userData}
              setUserData={setUserData}
              profilePhotoURL={profilePhotoURL}
              fileInputFile={fileInputFile}
              setFileInputFile={setFileInputFile}
              fileInputValue={fileInputValue}
              setFileInputValue={setFileInputValue}
              uid={uid}
              currenciesList={currenciesList}
            />
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard isLoggedIn={isLoggedIn} uid={uid} />}
        />

        <Route
          path="/signup"
          element={
            <SignUp
              isLoggedIn={isLoggedIn}
              fileInputFile={fileInputFile}
              setFileInputFile={setFileInputFile}
              fileInputValue={fileInputValue}
              setFileInputValue={setFileInputValue}
            />
          }
        />

        <Route
          path="/authform"
          element={<AuthForm isLoggedIn={isLoggedIn} />}
        />

        <Route
          path="/resetpassword"
          element={<ResetPassword isLoggedIn={isLoggedIn} />}
        />

        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}
