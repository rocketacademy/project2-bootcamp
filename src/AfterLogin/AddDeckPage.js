import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import FlashcardForm from "./FlashcardForm";
import "./AddDeckPage.css";
import { ref, set, get } from "firebase/database";
import { database } from "../firebase";
import ErrorPage from "../ErrorPage";

export default function AddDeckPage() {
  const [user] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDeck] = useState([]);
  const navi = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const addCard = (englishValue, spanishValue) => {
    const newCardId = Date.now();
    const newCard = {
      cardID: newCardId,
      english: englishValue,
      spanish: spanishValue,
    };
    const newDeck = [...deck, newCard];
    setDeck(newDeck);
  };

  const deleteCard = async (cardID) => {
    const deckCopy = [...deck];
    const newDeck = deckCopy.filter((card) => card.cardID !== cardID);
    setDeck(newDeck);
  };

  const addDeckToDatabase = async (deckId) => {
    const cardIDs = deck.map((card) => card.cardID);
    try {
      await set(ref(database, "decks/deck" + deckId), {
        deckID: deckId,
        deckName: deckName,
        deckCards: cardIDs,
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const addCardsToDatabase = async (cardId, card) => {
    try {
      await set(ref(database, "cards/card" + cardId), card);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const updateUserInfo = async (deckId) => {
    const userDeckRef = ref(database, `userInfo/${user.uid}/decks`);
    try {
      const originalDecks = await get(userDeckRef);
      const originalDecksIDs = !originalDecks.val() ? [] : originalDecks.val();
      const newDeckInfo = [...originalDecksIDs, deckId];
      await set(userDeckRef, newDeckInfo);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSave = async () => {
    try {
      if (!deckName) {
        throw new Error("You need to name your deck.");
      }
      if (!deck.length) {
        throw new Error("You need to add card to your new deck.");
      }
      const deckId = Date.now();
      const cardsPromise = deck.map(
        async (card) => await addCardsToDatabase(card.cardID, card)
      );
      const promises = [
        ...cardsPromise,
        addDeckToDatabase(deckId),
        updateUserInfo(deckId),
      ];
      await Promise.all(promises);
      setDeckName("");
      navi("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const currDeck = deck.map((card, index) => {
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
        <div>{currDeck}</div>
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
