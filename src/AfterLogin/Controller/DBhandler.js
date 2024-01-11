import { get, ref, set, update } from "firebase/database";
import { database } from "../../firebase";

export default class DBhandler {
  constructor(uid, setErrorMessage, setGoHome) {
    this.uid = uid;
    this.setErrorMessage = setErrorMessage;
    this.setGoHome = setGoHome;
  }

  //check the deck valid for user
  checkUserDeckID = async (deckID, isGoHome) => {
    try {
      const userInfo = await this.getUserInfo(isGoHome);
      const userDeckIDs = userInfo.decks ? userInfo.decks : [];
      if (!userDeckIDs.length || !userDeckIDs.includes(Number(deckID))) {
        throw new Error("You don't have this deck!");
      }
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };

  //get the user Info
  getUserInfo = async (isGoHome) => {
    const userInfoRef = ref(database, `userInfo/${this.uid}`);
    try {
      const newUserInfo = await get(userInfoRef);
      return newUserInfo.val();
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };

  //get single deck Info
  getDeckInfo = async (deckID, isGoHome) => {
    try {
      const decksRef = ref(database, `decks/deck${deckID}`);
      const res = await get(decksRef);
      return res.val();
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };

  //get single card Info
  getCardsInfo = async (cardID, isGoHome) => {
    try {
      const cardRef = ref(database, `cards/card${cardID}`);
      const res = await get(cardRef);
      return res.val();
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };

  //Get single deck and cards in that deck
  getDeckAndCards = async (deckID, isGoHome) => {
    try {
      const deckInfo = await this.getDeckInfo(deckID, isGoHome);
      if (!deckInfo) throw new Error("Deck not found");

      const cardNumber = Object.values(deckInfo.deckCards);
      const cardPromises = cardNumber.map(
        async (cardID) => await this.getCardsInfo(cardID, isGoHome)
      );
      const cardsInfo = await Promise.all(cardPromises);
      return { deckInfo, cardsInfo };
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };

  //get user info and decks detail related to user
  getUserAndDecksInfo = async (isGoHome) => {
    try {
      const userInfo = await this.getUserInfo(isGoHome);
      const userDeckIDs = userInfo.decks ? userInfo.decks : [];
      const decksPromise = userDeckIDs
        ? userDeckIDs.map(
            async (deckID) => await this.getDeckInfo(deckID, isGoHome)
          )
        : [];
      const userDecks = await Promise.all(decksPromise);
      return { userInfo, userDecks };
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(true);
    }
  };

  //update/setuserURL
  putUserPicURL = async (url) => {
    const userPicRef = ref(database, `userInfo/${this.uid}/profilePic`);
    try {
      await set(userPicRef, url);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //delete deck from user and return decks detail related to user
  deleteUserDeck = async (deckID) => {
    try {
      const userInfo = await this.getUserInfo(false);
      const userDeckIDs = userInfo.decks;
      const deleteDeckIndex = userDeckIDs.findIndex(
        (userDeckID) => userDeckID === deckID
      );
      //We want to keep the array structure, so using update instead of delete
      const newUserDeckIDs = userDeckIDs.toSpliced(deleteDeckIndex, 1);
      const userDeckIDsRef = ref(database, `userInfo/${this.uid}/decks/`);
      await update(userDeckIDsRef, newUserDeckIDs);
      const decksPromise = userDeckIDs
        ? userDeckIDs.map(
            async (deckID) => await this.getDeckInfo(deckID, false)
          )
        : [];
      const userDecks = await Promise.all(decksPromise);
      return userDecks;
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //upload a new Card
  postNewCard = async (card) => {
    const newCardRef = ref(database, `cards/card${card.cardID}`);
    try {
      await set(newCardRef, card);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //upload a new Deck
  postNewDeck = async (deck) => {
    const newDeckRef = ref(database, `decks/deck${deck.deckID}`);
    try {
      await set(newDeckRef, deck);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //update user deck to another deck
  //deck is new Info with old deckID
  postUserDecks = async (deck, cards) => {
    const userDeckRef = ref(database, `userInfo/${this.uid}/decks`);
    try {
      const newCards = [];
      const cardsPromises = deck.deckCards.map(
        async (cardID) => await this.getCardsInfo(cardID, false)
      );
      //comparing cards order following deck.deckCardsID
      const comparingCards = await Promise.all(cardsPromises);

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        //Checking for newCard
        if (!comparingCards.includes(card.id)) {
          newCards.push(card);
          continue;
        }
        //old Card with edited card
        const comparingCardIndex = comparingCards.findIndex(
          (comparingCard) => comparingCard.cardID === card.cardID
        );
        const comparingCard = comparingCards[comparingCardIndex];
        if (
          card.english !== comparingCard.english ||
          card.spanish !== comparingCard.spanish
        ) {
          const newCardID = Date.now() + i;
          newCards.push({ ...card, cardID: newCardID });
          deck.deckCards[i] = newCardID;
        }
      }
      console.log(newCards);
      //No new cards means the deck is the same as before
      if (!newCards.length) {
        return;
      }
      for (const card of newCards) {
        await this.postNewCard(card);
      }
      const newDeckID = Date.now();
      await this.postNewDeck({ ...deck, deckID: newDeckID });
      const res = await get(userDeckRef);
      const userDeckIDs = res.val() ? res.val() : [];
      const deckIndex = userDeckIDs.findIndex(
        (deckID) => deckID === deck.deckID
      );
      userDeckIDs[deckIndex] = newDeckID;
      await set(userDeckRef, [...userDeckIDs]);
    } catch (error) {
      console.log(error);
    }
  };
}
