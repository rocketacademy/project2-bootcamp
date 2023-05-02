import React, { useContext } from "react";
import { useState } from "react";
import "./SearchPokeScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import {
  faPlus,
  faStar,
  faMagnifyingGlass,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";
import { UserContext } from "../../App";

const pokeObj = {
  type: null,
  imgURL: null
}

//comment
const SearchPokeScreen = ({ DB_USERS_KEY }) => {
  const [input, setInput] = useState("");
  const [pokeData, setPokeData] = useState(pokeObj);
  const [pokeName, setPokeName] = useState("");
  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${input}`)
      .then((response) => {
        setPokeData()
        const retrievedData = {
          type: response.data.types[0].type.name,
          imgURL: response.data.sprites.front_default
        }
        console.log(retrievedData)
        setPokeName(response.data.name) //storing the response data as a state
        setPokeData(retrievedData); // --ditto--
      });
  };


  const handleClick = (e) => {
    const pokeRef = ref(database, DB_USERS_KEY + "/" + user.uid + "/" + e.target.id + "/" + pokeName)
    const listOrderRef = ref(database, DB_USERS_KEY + "/" + user.uid + "/" + e.target.id + "order")
    if (e.target.id == "topten") {
      get(pokeRef).then((data) => {
        if (data.exists()) {
          alert('pokemon in list')
        } else {
          set(pokeRef, pokeData)  //setPokeData(retrievedData);
            .then(() => {
              get(listOrderRef).then((data) => {
                if (data.exists()) {
                  const newList = [...data.val(), pokeName]
                  set(listOrderRef, newList)
                } else {
                  set(listOrderRef, [pokeName])
                }

              })
            })
        }


      })



    } else if (e.target.id == "wishlist") {

    }
  };
  return (
    <div className="pokeSearch">
      <button className="back">
        <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
      </button>

      <h1 className="addPoke">Add Pokemon</h1>
      <div>
        <div className="flex-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="enter pokemon name"
              className="pokeSearchBox"
              onChange={handleChange}
              value={input}
            ></input>

            <button type="submit" className="pokeSearchIcon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
            </button>
          </form>
        </div>

        <br />
        {/* <h1>{pokeData}</h1> */}

        <div>
          <div className="flex-container">
            <div className="flex-item results">{pokeData}</div>
            <button
              className="flex-item plus"
              onClick={handleClick}
              id="topten"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className="flex-item star"
              onClick={handleClick}
              id="wishlist"
            >
              <FontAwesomeIcon icon={faStar} />
            </button>
          </div>
        </div>

        <br />
      </div>
    </div>
  );
};
export default SearchPokeScreen;
