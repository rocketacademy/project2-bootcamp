import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import FlashcardForm from "./CardComponent/FlashcardForm";
import "./AddDeckPage.css";
import ErrorPage from "../ErrorPage";
import DBhandler from "./Controller/DBhandler";

export default function AddDeckPage() {
  const [user] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState([]);
  const navi = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const dbHandler = useMemo(
    () => new DBhandler(user.uid, setErrorMessage),
    [user.uid, setErrorMessage]
  );
  const { deckID } = useParams();
  console.log(deckID);
  const addCard = (englishValue, spanishValue) => {
    const newCardId = Date.now();
    const newCard = {
      cardID: newCardId,
      english: englishValue,
      spanish: spanishValue,
    };
    const newCards = [...cards, newCard];
    setCards(newCards);
  };

  const deleteCard = async (cardID) => {
    const cardsCopy = [...cards];
    const newCards = cardsCopy.filter((card) => card.cardID !== cardID);
    setCards(newCards);
  };

  const handleSave = async () => {
    try {
      if (!deckName) {
        throw new Error("You need to name your deck.");
      }
      if (!cards.length) {
        throw new Error("You need to add card to your new deck.");
      }
      await dbHandler.putUserDecks(deckName, cards);
      navi("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const currCards = cards.map((card, index) => {
    return (
      <div key={index}>
        <div className="card mt-3" id="flashcard">
          <p>
            English: <br /> {card.english}
          </p>
          <p>
            Spanish:
            <br /> {card.spanish}
          </p>
          <button
            type="button"
            className="btn btn-outline-dark mt-3 mb-3"
            onClick={() => deleteCard(card.cardID)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div>
        <ErrorPage
          errorMessage={errorMessage}
          handleErrorMessage={() => setErrorMessage("")}
        />
        <label>Name your deck:</label>
        <input
          className="form-control mt-3 mb-4"
          type="text"
          name="title"
          placeholder="Title"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        ></input>
        <FlashcardForm addCard={addCard} />
        <div>{currCards}</div>
        <div>
          <button
            type="button"
            className="btn btn-outline-dark mt-3 mb-3"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
