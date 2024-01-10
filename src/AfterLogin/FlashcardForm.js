import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./AddDeckPage.css";
import { Autocomplete, TextField } from "@mui/material";
//Take the user data from App.js state

export default function FlashcardForm(props) {
  const [user, setUser] = useOutletContext();
  const [englishValue, setEnglishValue] = useState("");
  const [spanishValue, setSpanishValue] = useState([]);
  // const [translation, setTranslation] = useState("");

  const handleAddCard = () => {
    if (englishValue && spanishValue) {
      props.addCard(englishValue, spanishValue);
      setEnglishValue("");
      setSpanishValue("");
    }
  };

  const translateEnglishToSpanish = async (word) => {
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/spanish/json/${word}?key=${process.env.REACT_APP_SPANISH_KEY}`;

    const translation = [];

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.length) {
        let firstWord = response.data[0].shortdef[0];
        if (firstWord.includes(":")) {
          firstWord = firstWord.split(":")[1];
        }
        translation.push(firstWord);
        console.log(response.data);

        if (response.data[1] && response.data[1].shortdef.length) {
          let secondWord = response.data[1].shortdef[0];
          if (secondWord.includes(":")) {
            secondWord = secondWord.split(":")[1];
          }
          translation.push(secondWord);
        }
        if (response.data[2] && response.data[2].shortdef.length) {
          let thirdWord = response.data[2].shortdef[0];
          if (thirdWord.includes(":")) {
            thirdWord = thirdWord.split(":")[1];
          }
          translation.push(thirdWord);
        }

        console.log(translation);

        setSpanishValue(translation);
      } else {
        throw new Error("Translation not found");
      }
    } catch (error) {
      throw error;
    }
  };
  const handleTranslate = () => {
    const wordInEnglish = englishValue;
    translateEnglishToSpanish(wordInEnglish);
  };
  return (
    <div>
      <div>
        <div className="card" id="flashcard-form">
          <form>
            <label>English:</label>
            <br />
            <input
              className="form-control mt-3"
              type="text"
              name="english"
              placeholder="English term"
              value={englishValue}
              id="flashcard-form-input"
              onChange={(e) => setEnglishValue(e.target.value)}
            ></input>
            <button
              type="button"
              className="btn btn-outline-dark mt-3 mb-3"
              onClick={handleTranslate}
            >
              Translate into Spanish
            </button>
            <br />
            <label>Spanish:</label>
            <br />

            <Autocomplete
              options={spanishValue}
              disablePortal
              id="combo-box-demo"
              sx={{ width: 350 }}
              renderInput={(params) => (
                <TextField {...params} label="Spanish translation" />
              )}
            />
            <button
              type="button"
              className="btn btn-outline-dark mt-3 mb-2"
              onClick={handleAddCard}
            >
              Add card
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
