import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../firebase";
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.css";
import "./SignInPage.css";
import ErrorPage from "../ErrorPage";

// need to add logic to Register with firebase auth
//After register into the auth, return to "/"
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();

  const theme = useTheme();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password, name);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      await writeUserData(auth.currentUser.uid);
      setEmail("");
      setPassword("");
      setName("");
      navi("/");
    } catch (error) {
      setErrorMessage(error.message.slice(10));
    }
  };

  const writeUserData = async () => {
    try {
      await set(ref(database, "userInfo/" + auth.currentUser.uid), {
        userID: auth.currentUser.uid,
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const changePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="App">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      {/* <Link to="/" className="homepage-button">
        <CloseIcon />
      </Link> */}

      <div className="header">
        <h2>Hi, nice to meet you!</h2>
      </div>
      <div className="register-page-content">
        <div>
          <img className="register-img" src="register-page.png" alt="log-in" />
        </div>
        <div className="form">
          <div className="mb-3">
            <label className="form-label">
              Name or nickname:
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Brian"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Email:
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="brian123@brian.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Password:
              <div className="password-input-container">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
                <div className="password-visibility-icon">
                  {isPasswordVisible ? (
                    <VisibilityIcon
                      sx={{
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "medium",
                        },
                        [theme.breakpoints.up("md")]: {
                          fontSize: "medium",
                        },
                        [theme.breakpoints.up("lg")]: {
                          fontSize: "large",
                        },
                      }}
                      onClick={changePasswordVisibility}
                    />
                  ) : (
                    <VisibilityOffIcon
                      sx={{
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "medium",
                        },
                        [theme.breakpoints.up("md")]: {
                          fontSize: "medium",
                        },
                        [theme.breakpoints.up("lg")]: {
                          fontSize: "large",
                        },
                      }}
                      onClick={changePasswordVisibility}
                    />
                  )}
                </div>
              </div>
            </label>
          </div>
          <button type="button" className="btn btn-dark " onClick={register}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
