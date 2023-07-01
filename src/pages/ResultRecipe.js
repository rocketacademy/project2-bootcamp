import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const DetailWrapper = styled.div`
  margin-top: 10rem;
  margin-bottom: 5rem;
  margin-left: 3rem;
  display: flex;
  .active {
    background: linear-gradient(35deg, #494949, #313131);
    color: white;
  }
  h2 {
    margin-bottom: 2rem;
  }
  li {
    font-size: 1rem;
    line-height: 2rem;
  }
  ul {
    margin-top: 2rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  color: #313131;
  background: white;
  border: 2px solid black;
  margin-right: 2rem;
  font-weight: 600;
`;

const Info = styled.div`
  margin-left: 10rem;
`;

const StyledInstructions = styled.h3`
  text-align: left;
  margin-top: 2rem;
  margin-right: 3rem;
  font-size: 1.5rem;
`;

const StyledIngredients = styled.h3`
  text-align: left;
  margin-top: 2rem;
  margin-right: 3rem;
  font-size: 1.5rem;
`;

function ResultRecipe() {
  const [details, setDetails] = useState({});
  const [activeTab, setActiveTab] = useState("Instructions");
  let { recipeName } = useParams();

  useEffect(() => {
    const fetchResultRecipe = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeName}/information?apiKey=${process.env.REACT_APP_API_KEY3}`
        );
        const recipe = response.data;
        setDetails(recipe);
        console.log(recipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchResultRecipe();
  }, [recipeName]);

  return (
    <DetailWrapper>
      <div>
        <h2>{details.title}</h2>
        <img src={details?.image} alt="" />
      </div>
      <Info>
        <Button
          className={activeTab === "instructions" ? "active" : ""}
          onClick={() => setActiveTab("instructions")}
        >
          Instructions
        </Button>
        <Button
          className={activeTab === "ingredients" ? "active" : ""}
          onClick={() => setActiveTab("ingredients")}
        >
          Ingredients
        </Button>
        <br />
        {activeTab === "instructions" && (
          <div>
            <StyledInstructions
              dangerouslySetInnerHTML={{ __html: details.summary }}
            ></StyledInstructions>
            <br />
            <StyledInstructions
              dangerouslySetInnerHTML={{ __html: details.instructions }}
            ></StyledInstructions>
          </div>
        )}
        {activeTab === "ingredients" && (
          <div>
            <StyledIngredients></StyledIngredients>
            <ul>
              {details.extendedIngredients?.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
          </div>
        )}
      </Info>
    </DetailWrapper>
  );
}

export default ResultRecipe;
