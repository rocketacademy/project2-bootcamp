import { useContext, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import { NavContext, UserContext } from "../../App";
import { formatName } from "../../utils";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "./SearchUserScreen.css";

const SearchUserScreen = ({ userList }) => {
  const [input, setInput] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const { user, DB_USERS_KEY } = useContext(UserContext);
  const { navigate } = useContext(NavContext);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.name.toLowerCase() === input.toLowerCase()) {
      alert("Why are you searching for yourself?");
    } else if (userList.includes(input.toLowerCase())) {
      const foundUserRef = ref(
        database,
        DB_USERS_KEY + "/" + input.toLowerCase()
      );
      get(foundUserRef).then((response) =>
        setFoundUser({ name: response.val().name, pic: response.val().pic })
      );
    } else {
      setFoundUser(null);
    }
    setInput("");
  };

  const handleClick = () => {
    navigate("/search/" + foundUser.name.toLowerCase());
  };

  let userDisplay;

  if (foundUser) {
    userDisplay = (
      <div id="user-search-results">
        <button id="user-search-profile" onClick={handleClick}>
          <img src={foundUser.pic} alt={foundUser.name} />
          <h1>{foundUser.name}</h1>
        </button>
      </div>
    );
  } else {
    userDisplay = <h1>No User Found!</h1>;
  }

  return (
    <div className="contents">
      <div id="user-search">
        <HeaderBar title={"User Search"} />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Enter Username"
          />
        </form>
        {userDisplay}
      </div>
      <NavBar />
    </div>
  );
};

export default SearchUserScreen;
