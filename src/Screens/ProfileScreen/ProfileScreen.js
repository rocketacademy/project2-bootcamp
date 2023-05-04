import { useContext, useState } from "react";
import { NavContext, UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import "./ProfileScreen.css";
import List from "../../Components/List/List";

const ProfileScreen = ({
  topten,
  toptenorder,
  setToptenorder,
  wishlist,
  wishlistorder,
  setWishlistorder,
  handleLogOut,
}) => {
  const { navigate, handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);
  const [tab, setTab] = useState("top-ten");

  const handleClick = () => {
    handleLogOut();
    navigate("/");
  };

  const handleToggle = (e) => {
    setTab(e.target.id);
  };

  return (
    <div className="contents">
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
            +
          </button>
        </div>
        {tab === "top-ten" ? (
          <List
            list={topten}
            listOrder={toptenorder}
            setOrder={setToptenorder}
            id="topten"
          />
        ) : (
          <List
            list={wishlist}
            listOrder={wishlistorder}
            setOrder={setWishlistorder}
            id="wishlist"
          />
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default ProfileScreen;
