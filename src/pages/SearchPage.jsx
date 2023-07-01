import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Search from "../components/SearchBar";
import { motion } from "framer-motion";

// mui styling
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Footer from "../components/Footer";

function SearchPage({ isHomePage }) {
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

  return (
    <div>
      <Search></Search>
      <Grid container spacing={1}>
        {searchedRecipes.map((item) => {
          return (
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    maxWidth: 345,
                    backgroundColor: "#386150",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                  key={item.id}
                >
                  <CardActionArea
                    component={Link}
                    to={`/recipe/${item.id}`}
                    key={item.id}
                  >
                    <CardMedia component="img" src={item.image} alt="" />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{
                          fontFamily: "gill sans, sans-serif",
                          fontSize: "1.5rem",
                          color: "white",
                        }}
                      >
                        {item.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
      {!isHomePage && <Footer />}
    </div>
  );
}

export default SearchPage;
