import { useContext } from "react";
import { NavContext, UserContext } from "../../App";
import "./HeaderBar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const userObj = {
  uid: null,
  email: null,
  name: null,
  pic: null,
};

const HeaderBar = ({ title }) => {
  const { user, setUser } = useContext(UserContext);
  const { navigate } = useContext(NavContext);

  const handleLogOut = async () => {
    await setUser(userObj);
    signOut(auth);
  };

  const handleClick = () => {
    handleLogOut();
    navigate("/");
  };

  return (
    <div id="header">
      <div id="header-user">
        {title === user.name && <img src={user.pic} alt={user.name} />}
        <h1>{title}</h1>
      </div>
      <button onClick={handleClick} id="/">
        Log Out
      </button>
    </div>
  );
};

export default HeaderBar;
