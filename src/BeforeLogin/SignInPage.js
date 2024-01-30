import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import ErrorPage from "../ErrorPage";
import "./SignInPage.css";
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// need to add logic to Sign in with firebase auth
//After login into the auth, return to "/"
export default function SignInPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navi = useNavigate();
  const theme = useTheme();

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      setEmail("");
      setPassword("");
      setName("");
      navi("/");
    } catch (error) {
      setErrorMessage(error.message.slice(10));
    }
  };

  const changePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const handleForgotPasswordClick = () => {
    navi("/reset-password");
  };

  const handleGoToRegisterPage = () => {
    navi("/register");
  };
  return (
    <div className="App">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <div className="header">
        <h2>Welcome back, amigo! </h2>
      </div>
      <div className="log-in-page-content">
        <div>
          <img className="log-in-img" src="log-in.png" alt="log-in" />
        </div>
        <div className="form">
          <div className="mb-3">
            <label className="form-label">
              Email:
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="brian123@brian.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="mb-2">
            <label className="form-label">
              Password:
              <div className="password-input-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  className="form-control"
                  name="password"
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
          <h6 onClick={handleForgotPasswordClick}>Forgot your password?</h6>
          <h6 className="mt-1" onClick={handleGoToRegisterPage}>
            Don't have an account? Click here to register.
          </h6>
          <button type="button" className="btn btn-dark  mt-3" onClick={logIn}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
