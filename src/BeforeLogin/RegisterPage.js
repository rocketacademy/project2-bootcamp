import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../firebase";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import "bootstrap/dist/css/bootstrap.css";
import ErrorPage from "../ErrorPage";

// need to add logic to Register with firebase auth
//After register into the auth, return to "/"
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();

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

  return (
    <div className="App">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <Link to="/" className="homepage-button">
        <DisabledByDefaultOutlinedIcon />
      </Link>
      <h2 className="mb-5">Hi, nice to meet you!</h2>
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
          <input
            type="text"
            className="form-control"
            name="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
      </div>
      <button type="button" className="btn btn-dark mb-4" onClick={register}>
        Register
      </button>
    </div>
  );
}
