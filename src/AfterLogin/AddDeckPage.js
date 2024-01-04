import { useOutletContext } from "react-router-dom";
import { useState } from "react";

import FlashcardForm from "./FlashcardForm";
//Take the user data from App.js state

export default function AddDeckPage() {
  const [user, setUser] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDeck] = useState([]);
  const [cardNumber, setCardNumber] = useState(1);
  const addCard = (englishValue, spanishValue) => {
    setCardNumber(cardNumber + 1);
    let newCard = {
      id: Date.now(),
      number: cardNumber,
      english: englishValue,
      spanish: spanishValue,
    };
    const newDeck = [...deck, newCard];
    setDeck(newDeck);
    console.log("adding card");
  };

  const currDeck = deck.map((card, index) => {
    return (
      <div key={index}>
        <div className="card mt-3">
          <p>{card.number}</p>
          <p>English: {card.english}</p>
          <p>Spanish:{card.spanish}</p>
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
        {currDeck}
      </div>
    </div>
  );
}
