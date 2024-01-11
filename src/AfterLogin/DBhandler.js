import { get, ref } from "firebase/database";
import { database } from "../firebase";

export default class DBhandler {
  constructor(uid, setErrorMessage, setGoHome) {
    this.uid = uid;
    this.setErrorMessage = setErrorMessage;
    this.setGoHome = setGoHome;
  }
  checkUserDeckID = async (deckID, isGoHome) => {
    try {
      const userDeckIDsSS = await get(
        ref(database, `userInfo/${this.uid}/decks`)
      );
      const userDeckIDs = userDeckIDsSS.val();
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

  takeDeckInfo = async (deckID, isGoHome) => {
    try {
      const decksRef = ref(database, `decks/deck${deckID}`);
      return await get(decksRef);
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };

  takeCardsInfo = async (cardID, isGoHome) => {
    try {
      const cardsRef = ref(database, `cards/card${cardID}`);
      return await get(cardsRef);
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };

  fetchDeckAndCards = async (deckID, isGoHome) => {
    try {
      await this.checkUserDeckID(deckID, isGoHome);
      const deckInfo = await this.takeDeckInfo(deckID, isGoHome);
      const deckInfoData = deckInfo.val();

      if (deckInfoData) {
        const cardNumber = Object.values(deckInfoData.deckCards);
        const cardPromises = cardNumber.map(
          async (cardID) => await this.takeCardsInfo(cardID, isGoHome)
        );
        const cardInfo = await Promise.all(cardPromises);
        const cardInfoData = cardInfo.map((number) => number.val());
        return { deckInfoData, cardInfoData };
      }
    } catch (error) {
      if (isGoHome) {
        this.setGoHome(true);
      }
      this.setErrorMessage(error.message);
    }
  };
}
