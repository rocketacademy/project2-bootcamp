import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

import FlashcardForm from "./FlashcardForm";
//Take the user data from App.js state

export default function AddDeckPage() {
  const [user, setUser] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDeck] = useState([]);
  const addCard = (englishValue, spanishValue) => {
    let newCard = {
      id: Date.now(),
      english: englishValue,
      spanish: spanishValue,
    };
    const newDeck = [...deck, newCard];
    setDeck(newDeck);
  };

  const deleteCard = (id) => {
    const deckCopy = [...deck];
    const newDeck = deckCopy.filter((card) => card.id !== id);
    setDeck(newDeck);
  };
  const currDeck = deck.map((card, index) => {
    return (
      <div key={index}>
        <div className="card mt-3">
          <p>English: {card.english}</p>
          <p>Spanish:{card.spanish}</p>
          <button
            type="button"
            className="btn btn-outline-dark mt-3 mb-3"
            onClick={() => deleteCard(card.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <div>
      AddDeckPage
      <div>
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
          <button type="button" className="btn btn-outline-dark mt-3 mb-3">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
