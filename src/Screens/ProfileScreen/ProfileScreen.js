import { useContext, useState } from "react";
import { NavContext, UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import "./ProfileScreen.css";
import ListTopTen from "../../Components/List/ListTopTen";
import ListWish from "../../Components/List/ListWish";

const ProfileScreen = (props) => {
  const { navigate, handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);
  const [tab, setTab] = useState("top-ten");

  const handleClick = () => {
    props.handleLogOut();
    navigate("/");
  };

  const handleToggle = (e) => {
    setTab(e.target.id);
  };

  return (
    <header className="App-header">
      <div id="profile-header">
        <div id="profile-header-user">
          <img src={user.pic} alt={user.name} />
          <h1>{user.name}</h1>
        </div>
        <button onClick={handleClick} id="/">
          Log Out
        </button>
      </div>
      <div id="profile-lists">
        <div id="profile-lists-tabs">
          <button onClick={handleToggle} id="top-ten">
            Top Ten
          </button>
          <button onClick={handleToggle} id="wishlist">
            Wishlist
          </button>
          <button onClick={handleNavigate} id="search-poke">
            Add Pokemon
          </button>
        </div>
        {tab === "top-ten" ? <ListTopTen /> : <ListWish />}
      </div>

      <NavBar />
    </header>
  );
};

export default ProfileScreen;
