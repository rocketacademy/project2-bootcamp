import NavBar from "../../Components/NavBar/NavBar";
import "./ExploreScreen.css";

const ExploreScreen = (props) => {
  return (
    <div className="contents">
      <div className="explore-header">
        <h1>Explore</h1>
      </div>
      <div className="explore-map">
        <img src="https://i.imgur.com/6h1JaNo.png" alt="map" />
      </div>
      <NavBar />
    </div>
  );
};

export default ExploreScreen;
