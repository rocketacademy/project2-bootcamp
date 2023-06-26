import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Search from "../components/SearchBar";

// mui styling
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions } from "@mui/material";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import ListItemButton from "@mui/material/ListItemButton";
import Popper from "@mui/material/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
// import { fade } from "@mui/material/styles/colorManipulator";

import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkIcon from "@mui/icons-material/Link";

function SearchPage() {
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  let params = useParams();

  const getSearchResults = async (name) => {
    const data = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY}&query=${name}&number=4`
    );
    const recipes = await data.json();
    setSearchedRecipes(recipes.results);
  };

  useEffect(() => {
    getSearchResults(params.search);
  }, [params.search]);

  const handleShare = (event, item) => {
    event.preventDefault();
    const recipeURL = `/recipe/${item.id}`;

    if (event.currentTarget.id === "facebook") {
      const link = `https://www.facebook.com/sharer/sharer.php?u=${recipeURL}`;
      window.open(link, "_blank");
    } else if (event.currentTarget.id === "copy") {
      navigator.clipboard.writeText(recipeURL);
    }
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
                  <IconButton aria-label="add to favorites">
                    <BookmarkAddIcon />
                  </IconButton>

                  <PopupState variant="popper" popupId="demo-popup-popper">
                    {(popupState) => (
                      <div>
                        <IconButton color="inherit" {...bindToggle(popupState)}>
                          <ShareIcon />
                        </IconButton>
                        <Popper {...bindPopper(popupState)} transition>
                          {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                              <Paper>
                                <List dense={true}>
                                  <ListItemButton
                                    id="facebook"
                                    onClick={(event) =>
                                      handleShare(event, item)
                                    }
                                  >
                                    <ListItemIcon>
                                      <FacebookIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Facebook" />
                                  </ListItemButton>

                                  <ListItemButton
                                    id="copy"
                                    onClick={(event) =>
                                      handleShare(event, item)
                                    }
                                  >
                                    <ListItemIcon>
                                      <LinkIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Copy Link" />
                                  </ListItemButton>
                                </List>
                              </Paper>
                            </Fade>
                          )}
                        </Popper>
                      </div>
                    )}
                  </PopupState>
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
