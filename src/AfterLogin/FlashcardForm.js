import { useState } from "react";
import axios from "axios";
import "./AddDeckPage.css";
import { Autocomplete, TextField } from "@mui/material";
import ErrorPage from "../ErrorPage";
//Take the user data from App.js state

export default function FlashcardForm(props) {
  const [englishValue, setEnglishValue] = useState("");
  const [options, setOptions] = useState([]);
  const [spanishValue, setSpanishValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [translation, setTranslation] = useState("");

  const handleAddCard = () => {
    if (englishValue && spanishValue) {
      props.addCard(englishValue, spanishValue);
      setEnglishValue("");
      setSpanishValue("");
      setOptions([]);
    }
  };

  const translateEnglishToSpanish = async (word) => {
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/spanish/json/${word}?key=${process.env.REACT_APP_SPANISH_KEY}`;

    try {
      const translation = [];

      const response = await axios.get(apiUrl);

      const removeColon = (word) => {
        if (word && word.includes(":")) word = word.split(":")[1];
        return word;
      };

      if (response.data && response.data.length) {
        let firstWord = response.data[0].shortdef[0];
        firstWord = removeColon(firstWord);
        firstWord = response.data[0].fl.concat(": ", firstWord);
        translation.push(firstWord);
        console.log(response.data[1]);

        const addTranslationOptions = (data) => {
          if (data && data.shortdef.length) {
            let word = data.shortdef[0];
            word = removeColon(word);
            word = data.fl.concat(": ", word);
            translation.push(word);
            return translation;
          }
        };
        const data1 = response.data[1];
        const data2 = response.data[2];

        addTranslationOptions(data1);
        addTranslationOptions(data2);

        console.log(translation);

        setOptions(translation);
      } else throw new Error("No translation found.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleTranslate = () => {
    const wordInEnglish = englishValue;
    translateEnglishToSpanish(wordInEnglish);
  };

  const handleAutocompleteChange = (event, value) => {
    setSpanishValue(value);
  };
  return (
    <div>
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
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
              options={options}
              disablePortal
              id="combo-box-demo"
              sx={{ width: 350 }}
              getOptionLabel={(option) => option}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Spanish translation"
                  value={spanishValue}
                />
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
