import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link } from "react-router-dom";

function Trending() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=1`
        );
        console.log(response.data);
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchData();
  }, []);

  const Wrapper = styled.div`
    margin: 1rem 0 rem;
  `;

  const Card = styled.div`
  min-height: 25rem;
  border-radius: 2rem;
  overflow: hidden;
  position: relative;

  img {
    border-radius: 2rem;
  }

  p {
    position: absolute;
    z-index: 10;
    left: 50%;
    bottom: 20%;
    transform: translate(-50%, 0%);
    color: white;
    width: 100%
    text-align: center;
    font-weight: 600;
    font-size: 1rem;
    height: 10%
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

  const Gradient = styled.div`
    z-index: 3;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  `;

  return (
    <div>
      <h4>Trending</h4>
      <Wrapper>
        <Splide
          options={{
            perPage: 2,
            pagination: false,
            drag: "free",
            gap: "1rem",
          }}
        >
          {recipes.map((recipe) => (
            <SplideSlide key={recipe.id}>
              <Card key={recipe.id}>
                <Link to={"/recipe/" + recipe.id}>
                  <p>{recipe.title}</p>
                  <img src={recipe.image} alt={recipe.title} />
                </Link>
                <Gradient />
              </Card>
            </SplideSlide>
          ))}
        </Splide>
      </Wrapper>
    </div>
  );
}

export default Trending;
