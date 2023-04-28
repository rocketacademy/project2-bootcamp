import { useContext } from "react";
import { NavContext, UserContext } from "../App";
import NavBar from "../Components/NavBar";

const ProfileScreen = (props) => {
  const { navigate, handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);

  const handleClick = () => {
    props.handleLogOut();
    navigate("/");
  };

  return (
    <header className="App-header">
      <h1>Profile</h1>
      <p>Welcome {user.name}</p>
      <img src={user.pic} alt={user.name} />
      <button onClick={handleClick} id="/">
        Log Out
      </button>
      <NavBar />
    </header>
  );
};

export default ProfileScreen;
