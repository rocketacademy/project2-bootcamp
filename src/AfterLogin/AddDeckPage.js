import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import FlashcardForm from "./FlashcardForm";
import "./AddDeckPage.css";
import { ref, set, get } from "firebase/database";
import { database } from "../firebase";

export default function AddDeckPage() {
  const [user, setUser] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDeck] = useState([]);
  const [deckId, setDeckId] = useState(Date.now());
  const navi = useNavigate();

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

    try {
      await set(ref(database, "decks/deck" + deckId), {
        deckID: deckId,
        deckName: deckName,
        deckCards: cardIDs,
      });
      console.log("Deck added to the database successfully!");
    } catch (error) {
      console.error("Error adding deck to the database:", error);
    }
  };

  const addCardsToDatabase = async (cardId, card) => {
    try {
      await set(ref(database, "cards/card" + cardId), card);
      console.log("Card added to the database successfully!");
    } catch (error) {
      console.error("Error adding card to the database:", error);
    }
  };

  const updateUserInfo = async () => {
    const userDeckRef = ref(database, `userInfo/${user.uid}/decks`);
    try {
      const originalDecks = await get(userDeckRef);
      console.log(originalDecks.val());
      const originalDecksIDs = originalDecks.val();

      if (originalDecksIDs) {
        try {
          const newDeckInfo = [...originalDecksIDs, deckId];
          await set(userDeckRef, newDeckInfo);
          console.log("UserInfo added to the database successfully!");
        } catch (error) {
          console.error("Error updating userInfo in the database:", error);
        }
      } else {
        try {
          await set(userDeckRef, [deckId]);
          console.log("UserInfo added to the database successfully!");
        } catch (error) {
          console.error("Error updating userInfo in the database:", error);
        }
      }
    } catch (error) {
      console.error("Error retrieving originalDecks from the database:", error);
    }
  };

  const handleSave = async () => {
    let card = {};
    for (let i = 0; i < deck.length; i++) {
      card = deck[i];
      try {
        await addCardsToDatabase(card.cardID, card);
        console.log("cards added successfully");
      } catch (error) {
        console.error("Error adding cards to database");
      }
    }
    try {
      await addDeckToDatabase(deck);
      console.log("Deck added to database successfuly");
    } catch (error) {
      console.error("Error adding deck to database");
    }

    try {
      await updateUserInfo();
      console.log("UserInfo updated successfuly");
    } catch (error) {
      console.error("Error updating userInfo in database");
    }
    setDeckName("");
    setDeckId(null);
    navi("/");
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
