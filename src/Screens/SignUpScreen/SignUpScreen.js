import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../App";
import "./SignUpScreen.css";

const userIcons = [
  "https://archives.bulbagarden.net/media/upload/f/fc/Cheryl_OD.png",
  "https://archives.bulbagarden.net/media/upload/1/1a/Blue_IV_OD.png",
  "https://archives.bulbagarden.net/media/upload/2/2c/Artist_IV_OD.png",
  "https://archives.bulbagarden.net/media/upload/8/82/Bugsy_IV_OD.png",
];

const SignUpScreen = (props) => {
  const navigate = useNavigate();
  const handleNavigate = (e) => {
    navigate(`/${e.target.id}`);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const user = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password && name && pic) {
      if (password === passwordAgain) {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        props.setUser({
          uid: user.uid,
          email: user.email,
          name: name,
          pic: pic,
        });
        navigate("/profile");
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  let iconList = userIcons.map((url, index) => (
    <button
      key={url}
      onClick={(e) => {
        e.preventDefault();
        setPic(url);
      }}
    >
      <img src={url} alt={`user-icon-${index}`} />
    </button>
  ));

  return (
    <div id="signup">
      <header className="App-header">
        <button onClick={handleNavigate} id="">
          Back
        </button>
        <h1>Signup</h1>
        <form>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Display Name"
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <input
            id="passwordAgain"
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            placeholder="Enter password again"
          />
          <p>Select your character</p>
          <div className="user-icons">{iconList}</div>
          <button onClick={handleSubmit} id="login">
            Sign Up
          </button>
        </form>
      </header>
    </div>
  );
};

export default SignUpScreen;
