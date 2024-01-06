import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../firebase";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import "bootstrap/dist/css/bootstrap.css";

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
    await set(ref(database, "userInfo/" + auth.currentUser.uid), {
      userID: auth.currentUser.uid,
    });
  };

  return (
    <div className="App">
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
      {errorMessage.length ? (
        <div className="errorMessage">
          <h4>{errorMessage}</h4>
        </div>
      ) : null}
    </div>
  );
}
