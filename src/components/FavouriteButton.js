import React from "react";
import IconButton from "@mui/material/IconButton";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

function FavouriteButton() {
  const saveToFavourites = (event) => {
    return console.log("save to favourites");
  };
  return (
    <IconButton aria-label="add to favorites">
      <BookmarkAddIcon onClick={saveToFavourites} />
    </IconButton>
  );
}

export default FavouriteButton;
