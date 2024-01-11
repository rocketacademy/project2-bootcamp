import { get, ref } from "firebase/database";
import { database } from "../firebase";

export default class fetchAndCheck {
  checkUserDeckID = async (uid, deckID, setErrorMessage, setGoHome) => {
    try {
      const userDeckIDsSS = await get(ref(database, `userInfo/${uid}/decks`));
      const userDeckIDs = userDeckIDsSS.val();
      if (!userDeckIDs.length || !userDeckIDs.includes(Number(deckID))) {
        throw new Error("You don't have this deck!");
      }
    } catch (error) {
      if (setGoHome) {
        setGoHome(true);
      }
      setErrorMessage(error.message);
    }
  };

  takeDeckInfo = async (deckID, setErrorMessage, setGoHome) => {
    try {
      const decksRef = ref(database, `decks/deck${deckID}`);
      return await get(decksRef);
    } catch (error) {
      if (setGoHome) {
        setGoHome(true);
      }
      setErrorMessage(error.message);
    }
  };

  takeCardsInfo = async (cardID, setErrorMessage, setGoHome) => {
    try {
      const cardsRef = ref(database, `cards/card${cardID}`);
      return await get(cardsRef);
    } catch (error) {
      if (setGoHome) {
        setGoHome(true);
      }
      setErrorMessage(error.message);
    }
  };

  fetchDeckAndCards = async (uid, deckID, setErrorMessage, setGoHome) => {
    try {
      await this.checkUserDeckID(uid, deckID, setErrorMessage, setGoHome);
      const deckInfo = await this.takeDeckInfo(
        deckID,
        setErrorMessage,
        setGoHome
      );
      const deckInfoData = deckInfo.val();

      if (deckInfoData) {
        const cardNumber = Object.values(deckInfoData.deckCards);
        const cardPromises = cardNumber.map(
          async (cardID) =>
            await this.takeCardsInfo(cardID, setErrorMessage, setGoHome)
        );
        const cardInfo = await Promise.all(cardPromises);
        const cardInfoData = cardInfo.map((number) => number.val());
        return { deckInfoData, cardInfoData };
      }
    } catch (error) {
      setGoHome(true);
      setErrorMessage(error.message);
    }
  };
}
