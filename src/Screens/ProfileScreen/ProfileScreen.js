import { useContext } from "react";
import { NavContext, UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import "./ProfileScreen.css";

const ProfileScreen = (props) => {
  const { navigate, handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);

  const handleClick = () => {
    props.handleLogOut();
    navigate("/");
  };

  return (
    <header className="App-header">
      <div id="profile-header">
        <div className="profile-header-user">
          <img src={user.pic} alt={user.name} />
          <h1>{user.name}</h1>
        </div>
        <button onClick={handleClick} id="/">
          Log Out
        </button>
      </div>
      <button onClick={handleClick} id="/">
        Add Pokemon
      </button>
      <NavBar />
    </header>
  );
};

export default ProfileScreen;
