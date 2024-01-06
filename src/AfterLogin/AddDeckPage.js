import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import FlashcardForm from "./FlashcardForm";
import "./AddDeckPage.css";
import { ref, set, remove } from "firebase/database";
import { database } from "../firebase";

export default function AddDeckPage() {
  const [user, setUser] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDeck] = useState([]);
  const addCard = (englishValue, spanishValue) => {
    const newCardId = Date.now();
    const newCard = {
      cardID: newCardId,
      english: englishValue,
      spanish: spanishValue,
    };
    const newDeck = [...deck, newCard];
    setDeck(newDeck);
    addCardsToDatabase(newCardId, newCard);
  };

  const addCardsToDatabase = async (cardId, card) => {
    try {
      await set(ref(database, "cards/" + cardId), card);
      console.log("Card added to the database successfully!");
    } catch (error) {
      console.error("Error adding card to the database:", error);
    }
  };

  const deleteCard = async (cardID) => {
    const deckCopy = [...deck];
    const newDeck = deckCopy.filter((card) => card.cardID !== cardID);
    setDeck(newDeck);
    try {
      await remove(ref(database, "cards/" + cardID));
      console.log("Card deleted from the database successfully!");
    } catch (error) {
      console.error("Error deleting card from the database:", error);
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

  const addDeckToDatabase = async () => {
    const cardIDs = deck.map((card) => card.cardID);
    const newDeckId = Date.now();
    try {
      await set(ref(database, "decks/" + newDeckId), {
        deckID: newDeckId,
        deckName: deckName,
        deckCards: cardIDs,
      });
      console.log("Deck added to the database successfully!");
    } catch (error) {
      console.error("Error adding deck to the database:", error);
    }
  };

  const handleSave = async () => {
    addDeckToDatabase(deck);
    const newDeckId = await addDeckToDatabase();
    if (newDeckId) {
      const userInfo = {
        userID: user.uid,
        decks: [newDeckId],
      };

      try {
        await set(ref(database, "userInfo/" + user.uid), userInfo);
        console.log("UserInfo added to the database successfully!");
      } catch (error) {
        console.error("Error updating userInfo in the database:", error);
      }
    }
    setDeckName("");
  };
  return (
    <div>
      <div>
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
