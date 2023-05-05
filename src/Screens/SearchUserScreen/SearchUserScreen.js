import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "./SearchUserScreen.css";

const SearchUserScreen = () => {
  return (
    <div className="contents">
      <HeaderBar title={"Search"} />
      <NavBar />
    </div>
  );
};

export default SearchUserScreen;
