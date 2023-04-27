import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const ProfileScreen = (props) => {
  const navigate = useNavigate();
  const handleNavigate = (e) => {
    navigate(`/${e.target.id}`);
  };

  const user = useContext(UserContext);

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
    </header>
  );
};

export default ProfileScreen;
