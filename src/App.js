import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from "./Pages/Welcome";
import { realTimeDatabase, auth } from "./firebase";
import { ref, onValue, get, off } from "firebase/database";
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
import Category from "./Pages/Category";

const DB_USER_FOLDER_NAME = "user";
// const DB_EXPENSES_FOLDER_NAME = "expenses";
// const DB_CATEGORY_FOLDER_NAME = "categories";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const [uid, setUid] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [fileInputFile, setFileInputFile] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  // const [expenses, setExpenses] = useState([]);
  // const [categoriesData, setCategoriesData] = useState([]);
  const [currenciesList, setCurrenciesList] = useState([]);
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUid(user.uid);

        const userDataRef = ref(
          realTimeDatabase,
          `${DB_USER_FOLDER_NAME}/${uid}`
        );
        get(userDataRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val(); // Retrieve the data of the node
              setUserData(userData);
              console.log("user Data:", userData);
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
        setUid("");
        setProfilePhotoURL("");
      }
    });
  }, [uid]);

  // convert currencies from array of objects to array of strings
  useEffect(() => {
    const currencyList = currencies.map((currency) => currency.code);
    setCurrenciesList(currencyList);
  }, []);
  // console.log(currenciesList);

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
                    <NavDropdown.Item href="/category">
                      Category
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsLoggedIn(false);
                        signOut(auth);
                        setProfilePhotoURL("");
                        setUid("");
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
              // expensesCategory={expensesCategory}
              currenciesList={currenciesList}
              // categoriesData={categoriesData}
              // isLoading={isLoading}
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
          path="/category"
          element={<Category uid={uid} isLoggedIn={isLoggedIn} />}
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
