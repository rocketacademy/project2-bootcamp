import { useMemo, useState } from "react";
import "../AddDeckPage.css";
import { Autocomplete, TextField } from "@mui/material";
import ErrorPage from "../../ErrorPage";
import Translator from "../Controller/Translator";
//Take the user data from App.js state

export default function FlashcardForm(props) {
  const [englishValue, setEnglishValue] = useState("");
  const [options, setOptions] = useState([]);
  const [spanishValue, setSpanishValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const translator = useMemo(
    () => new Translator(setErrorMessage, process.env.REACT_APP_SPANISH_KEY),
    [setErrorMessage]
  );

  const handleAddCard = () => {
    if (englishValue && spanishValue) {
      props.addCard(englishValue, spanishValue);
      setEnglishValue("");
      setSpanishValue("");
      setOptions([]);
    }
  };

  const translateEnglishToSpanish = async (eng) => {
    try {
      const translation = await translator.engToSpan(eng);
      setOptions(translation);
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
