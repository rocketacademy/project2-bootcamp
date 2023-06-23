import React from "react";
import { useState } from "react";
// import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

function Search() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/search/" + input);
  };

  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        // flexDirection: "column",
        padding: 20,
      }}
    >
      <form onSubmit={submitHandler}>
        <div>
          <TextField
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search..."
            value={input}
            variant="outlined"
            size="small"
            label="Search for a recipe"
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon style={{ fill: "blue" }} />
          </IconButton>
          <p>You're searching for "{input}"</p>
        </div>
      </form>
    </div>
  );
}

export default Search;

// const FormStyle = styled.form`
//   margin: 0rem 20rem;
//   div {
//     position: relative;
//     width: 100%;
//   }
//   input {
//     border: none;
//     background: linear-gradient(35 deg, #494949, #313131);
//     font-size: 1.5rem;
//     color: black;
//     border-radius: 1 rem;
//     outline: none;
//     width: 100%;
//   }
// `;
