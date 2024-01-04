import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
//Take the user data from App.js state

export default function FlashcardForm(props) {
  const [user, setUser] = useOutletContext();
  const [englishValue, setEnglishValue] = useState("");
  const [spanishValue, setSpanishValue] = useState("");

  const handleAddCard = () => {
    props.addCard(englishValue, spanishValue);
    setEnglishValue("");
    setSpanishValue("");
  };

  return (
    <div>
      <div>
        <div className="card">
          <form>
            <label>English:</label>
            <br />
            <input
              className="form-control mt-3"
              type="text"
              name="english"
              value={englishValue}
              onChange={(e) => setEnglishValue(e.target.value)}
            ></input>
            <button type="button" className="btn btn-outline-dark mt-3 mb-3">
              Translate into Spanish
            </button>
            <br />
            <label>Spanish:</label>
            <br />
            <input
              className="form-control mt-3"
              type="text"
              name="spanish"
              value={spanishValue}
              onChange={(e) => setSpanishValue(e.target.value)}
            ></input>
            <button
              type="button"
              className="btn btn-outline-dark mt-3"
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
// const translate = () => {
//   const englishWord = englishValue;
//   const response = axios.get(
//     `https://www.dictionaryapi.com/api/v3/references/spanish/json/${englishWord}?key=b62458ec-20b6-4fc4-a681-0e682a4ea74e`
//   );
//   if (response.status === 200) {
//     const apiData = response.data;

//     if (apiData && apiData.length > 0) {
//       // Extract the first translation
//       const word = apiData[0].shortdef[0].split(",")[0];
//       const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
//       console.log(capitalizedWord);
//       setSpanishValue(capitalizedWord);
//     }
//   }
// };
