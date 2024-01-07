import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./AddDeckPage.css";
//Take the user data from App.js state

export default function FlashcardForm(props) {
  const [user, setUser] = useOutletContext();
  const [englishValue, setEnglishValue] = useState("");
  const [spanishValue, setSpanishValue] = useState("");
  // const [translation, setTranslation] = useState("");

  const handleAddCard = () => {
    if (englishValue && spanishValue) {
      props.addCard(englishValue, spanishValue);
      setEnglishValue("");
      setSpanishValue("");
    }
  };

  const translateEnglishToSpanish = async (word) => {
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/spanish/json/${word}?key=${process.env.REACT_APP_SPANISH_API_KEY}`;

    try {
      const response = await axios.get(apiUrl);

      if (Array.isArray(response.data) && response.data.length > 0) {
        const translation = response.data[0].shortdef[0].split(",")[0];
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
            <input
              className="form-control mt-3"
              type="text"
              name="spanish"
              id="flashcard-form-input"
              placeholder="Spanish translation"
              value={spanishValue}
              onChange={(e) => setSpanishValue(e.target.value)}
            ></input>
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
