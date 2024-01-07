import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FlashcardForm from "./FlashcardForm";
import "./AddDeckPage.css";
import { ref, set, get } from "firebase/database";
import { database } from "../firebase";

export default function AddDeckPage() {
  const [user, setUser] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDeck] = useState([]);
  const [deckIDs, setDeckIDs] = useState([]);
  const [deckId, setDeckId] = useState(Date.now());
  const navi = useNavigate();
  useEffect(() => {
    const fetchDeckIDs = async () => {
      const userInfoRef = ref(database, `userInfo/${user.uid}`);

      try {
        const snapshot = await get(userInfoRef);
        const userInfo = snapshot.val();
        if (userInfo && userInfo.decks) {
          const fetchedDeckIDs = userInfo.decks;
          setDeckIDs(fetchedDeckIDs);
        }
      } catch (error) {
        console.error("Error fetching deck IDs:", error);
      }
    };

    fetchDeckIDs();
  }, [user.uid]);

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
    const userInfo = {
      userID: user.uid,
      decks: [...deckIDs, deckId],
    };

    try {
      await set(ref(database, `userInfo/${user.uid}`), userInfo);
      console.log("UserInfo added to the database successfully!");
    } catch (error) {
      console.error("Error updating userInfo in the database:", error);
    }
  };

  const handleSave = async () => {
    await addDeckToDatabase(deck);

    let card = {};
    for (let i = 0; i < deck.length; i++) {
      card = deck[i];
      await addCardsToDatabase(card.cardID, card);
    }

    await updateUserInfo();
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
