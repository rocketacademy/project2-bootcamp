import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "./ExploreScreen.css";

const ExploreScreen = ({ userList }) => {
  return (
    <div className="contents">
      <HeaderBar title={"Explore"} />
      <div className="explore-map">
        <button className="user-button">{userList[0]}</button>
        <img id="map" src="https://i.imgur.com/6h1JaNo.png" alt="map" />
      </div>
      <NavBar />
    </div>
  );
};

export default ExploreScreen;
