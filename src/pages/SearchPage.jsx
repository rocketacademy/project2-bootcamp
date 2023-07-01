import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Search from "../components/SearchBar";
// import FavouriteButton from "../components/FavouriteButton";
import SharePopperButton from "../components/SharePopperButton";

// mui styling
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

function SearchPage() {
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [favourites, setFavourites] = useState([]);

  let params = useParams();

  const getSearchResults = async (name) => {
    const data = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY3}&query=${name}&number=1`
    );
    const recipes = await data.json();
    setSearchedRecipes(recipes.results);
  };

  useEffect(() => {
    console.log(favourites);
    getSearchResults(params.search);
  }, [params.search, favourites]);

  const handleShare = (event, item) => {
    event.preventDefault();
    const recipeURL = `localhost:3000/recipe/${item.id}`;

    if (event.currentTarget.id === "facebook") {
      const link = `https://www.facebook.com/sharer/sharer.php?u=${recipeURL}`;
      window.open(link, "_blank");
    } else if (event.currentTarget.id === "copy") {
      navigator.clipboard.writeText(recipeURL);
    }
  };

  const addFavouriteRecipe = (recipe) => {
    const newFavouriteList = [...favourites, recipe];
    setFavourites(newFavouriteList);
    console.log("Saved to favourites");
  };

  return (
    <div>
      <Search></Search>
      <Grid container spacing={2}>
        {searchedRecipes.map((item) => {
          return (
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Card sx={{ maxWidth: 345 }} key={item.id}>
                <CardActionArea
                  component={Link}
                  to={`/recipe/${item.id}`}
                  key={item.id}
                >
                  <CardMedia component="img" src={item.image} alt="" />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  {/* <FavouriteButton /> */}
                  <IconButton aria-label="add to favorites">
                    <BookmarkAddIcon onClick={() => addFavouriteRecipe(item)} />
                  </IconButton>
                  <SharePopperButton handleShare={handleShare} item={item} />
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default SearchPage;
