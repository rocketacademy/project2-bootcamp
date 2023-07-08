import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { onChildAdded, ref as databaseRef, remove } from "firebase/database";
import { auth, database } from "../config";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import CloseIcon from "@mui/icons-material/Close";

const FavouriteRecipes = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (userObj) => {
      if (userObj) {
        let currentUser = auth.currentUser;
        const favouritesRef = databaseRef(
          database,
          `/Users/${currentUser.uid}/favourites`
        );
        let array = [];
        onChildAdded(favouritesRef, (data) => {
          let favourite = data.val();
          favourite["key"] = data.key;
          array.push(favourite);
        });
        setFavourites(array);
      }
    });
  }, []);

  const removeFavouriteRecipe = (key) => {
    const updatedFavourites = favourites.filter((recipe) => recipe.key !== key);
    setFavourites(updatedFavourites);
    let currentUser = auth.currentUser;
    const favouriteRef = databaseRef(
      database,
      `/Users/${currentUser.uid}/favourites/${key}`
    );
    remove(favouriteRef);
  };

  const cardVariants = {
    hover: { scale: 1.05 },
  };

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src="https://www.reactiongifs.com/r/2012/11/fridge.gif"
        alt="Fridge GIF"
        style={{ height: "300px", marginBottom: "10px" }}
      />
      <Typography variant="h4" component="h1" marginBottom={2}>
        My Saved Recipes
      </Typography>
      <Grid container spacing={2}>
        {favourites.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.key}>
            <div style={{ position: "relative" }}>
              <Card
                sx={{
                  maxWidth: 345,
                  backgroundColor: "#386150",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                <Link
                  to={`/recipe/${recipe.key}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    variants={cardVariants}
                    transition={{ duration: 0.25 }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={recipe.imgUrl}
                      alt={recipe.title}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontFamily: "gill sans, sans-serif",
                          fontSize: "1.5rem",
                          color: "white",
                        }}
                      >
                        {recipe.title}
                      </Typography>
                    </CardContent>
                  </motion.div>
                </Link>
                <IconButton
                  aria-label="remove"
                  onClick={() => removeFavouriteRecipe(recipe.key)}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    zIndex: 1,
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "50%",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>
      <Footer />
    </div>
  );
};

export default FavouriteRecipes;
