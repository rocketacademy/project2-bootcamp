import { useContext, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import { UserContext } from "../../App";
import { formatName } from "../../utils";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "./SearchUserScreen.css";

const SearchUserScreen = ({ userList }) => {
  const [input, setInput] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const { user, DB_USERS_KEY } = useContext(UserContext);

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
      get(foundUserRef).then((response) => setFoundUser(response.val()));
    } else {
      alert("User not found!");
    }
    setInput("");
  };

  let userDisplay;

  if (foundUser) {
    const foundUserPokemon = foundUser.toptenorder.map((pokemon, index) => (
      <div className="user-poke" key={pokemon}>
        <h3>{index + 1}</h3>
        <h3>{formatName(pokemon)}</h3>
        <img src={foundUser.topten[pokemon].imgURL} alt={pokemon} />
      </div>
    ));
    userDisplay = (
      <div id="user-search-results">
        <div id="user-search-profile">
          <img src={foundUser.pic} alt={foundUser.name} />
          <h1>{foundUser.name}'s Top 10</h1>
        </div>
        {foundUserPokemon}
      </div>
    );
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
