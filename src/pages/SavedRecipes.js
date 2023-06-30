import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

const FavouriteRecipes = ({ favourites }) => {
  return (
    <p>My saved recipes</p>
    // <Grid container spacing={2}>
    //   {favourites.map((recipe, index) => (
    //     <Grid item xs={12} sm={6} md={4} key={index}>
    //       <Card>
    //         <CardMedia
    //           component="img"
    //           height="140"
    //           image={recipe.image}
    //           alt={recipe.title}
    //         />
    //         <CardContent>
    //           <Typography variant="h6" component="div">
    //             {recipe.title}
    //           </Typography>
    //           <Typography variant="body2" color="text.secondary">
    //             Ingredients: {recipe.ingredients.join(", ")}
    //           </Typography>
    //           <Typography variant="body2" color="text.secondary">
    //             Method: {recipe.method}
    //           </Typography>
    //         </CardContent>
    //       </Card>
    //     </Grid>
    //   ))}
    // </Grid>
  );
};

export default FavouriteRecipes;
