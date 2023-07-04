import React, { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { auth, database } from "../config";
import { onAuthStateChanged } from "firebase/auth";

const FavouriteRecipes = () => {
  const [favourties, setFavourites] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (userObj) => {
      // If user is logged in, save logged-in user to state
      if (userObj) {
        let currentUser = auth.currentUser;
        const favouritesRef = databaseRef(
          database,
          `/Users/${currentUser.uid}/favourites`
        );
        let array = [];
        onChildAdded(favouritesRef, (data) => {
          // Add subsequent child to local component state, initialising a new array to trigger re-render
          // Note the use of functional state update to access previous posts state
          // https://reactjs.org/docs/hooks-reference.html#functional-updates

          let favourite = data.val();
          favourite["key"] = data.key;

          array.push(favourite);
        });
        setFavourites(array);
      }
    });
  }, []);

  return (
    <div>
      <p>My saved recipes</p>
      <Grid container spacing={2}>
        {favourties.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.key}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={recipe.imgUrl}
                alt={recipe.title}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {recipe.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FavouriteRecipes;
