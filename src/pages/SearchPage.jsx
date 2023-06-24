import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// mui styling
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Search from "../components/SearchBar";

function SearchPage() {
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  let params = useParams();
  console.log(searchedRecipes)
  useEffect(() => {
    const getSearchResults = async (name) => {
      const data = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY2}&query=${name}&number=4`
      );
      const recipes = await data.json();
      setSearchedRecipes(recipes.results);
    };
    getSearchResults(params.search);
  }, [params.search]);

  return (
    // <Grid>
    //   {searchedRecipes.map((item) => {
    //     return (
    //       <Card key={item.id}>
    //         <img src={item.image} alt="" />
    //         <h4>{item.title}</h4>
    //       </Card>
    //     );
    //   })}
    // </Grid>
    <div>
      <Search />
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
                <CardActionArea>
                  <CardMedia component="img" src={item.image} alt="" />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
//   grip-gap: 3rem;
// `;

// const Card = styled.div`
// img
//   {
//   width:100%
//   border-radius: 2rem;
// }
// a
// {
//   text-decoration:none;}
// h4
// {text-align:center;
// padding: 1 rem;
// }`;

export default SearchPage;
