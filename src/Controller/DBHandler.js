import { get, ref, set } from "firebase/database";
import { database } from "../firebase";
import axios from "axios";

export default class DBHandler {
  constructor(uid, setErrorMessage, setGoHome) {
    this.uid = uid;
    this.setErrorMessage = setErrorMessage;
    this.setGoHome = setGoHome;
  }

  //check the deck valid for user
  //No return
  checkUserDeckID = async (deckID, isGoHome) => {
    try {
      const userInfo = await this.getUserInfo(isGoHome);
      const userDeckIDs = userInfo.decks ? userInfo.decks : [];
      if (!userDeckIDs.length || !userDeckIDs.includes(deckID)) {
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

  //get the user quiz list
  getUserQuizList = async () => {
    const quizListRef = ref(database, `userInfo/${this.uid}/quizReport`);
    try {
      const res = await get(quizListRef);
      const quizList = res.val();
      if (!quizList) {
        throw new Error("You have no Quiz taken.");
      }
      return quizList;
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //get the user quiz report
  getUserQuizReport = async (quizNo) => {
    const quizRef = ref(
      database,
      `userInfo/${this.uid}/quizReport/quiz${quizNo}`
    );
    try {
      const res = await get(quizRef);
      const quizReport = res.val();
      if (!quizReport) {
        throw new Error("You don't have this quiz.");
      }
      return quizReport;
    } catch (error) {
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
  getCardInfo = async (cardID, isGoHome) => {
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
  //return { deckInfo, cardsInfo }
  getDeckAndCards = async (deckID, isGoHome) => {
    try {
      const deckInfo = await this.getDeckInfo(deckID, isGoHome);
      if (!deckInfo) throw new Error("Deck not found");

      const cardNumber = Object.values(deckInfo.deckCards);
      const cardPromises = cardNumber.map(
        async (cardID) => await this.getCardInfo(cardID, isGoHome)
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

  //search Deck with user doesn't have.
  //return {resultInfo,adviceInfo] (array of deckInfo with new key cardInfos contains cards detail in that deck)
  searchData = async (keywordRaw) => {
    try {
      const keyword = keywordRaw.toLowerCase();
      const resultInfoSet = new Set();
      const remainInfo = new Set();
      const userInfo = await this.getUserInfo();
      const userDeckIDs = userInfo.decks ? userInfo.decks : [];
      const decksRef = ref(database, `decks`);
      const decksRes = await get(decksRef);
      const decks = decksRes.val();
      //comparing Cards is use to comparing cards with the search result
      const comparingCards = {};
      for (const userDeckID of userDeckIDs) {
        for (const cardID of decks[`deck${userDeckID}`].deckCards) {
          comparingCards[cardID] = true;
        }
        delete decks[`deck${userDeckID}`];
      }
      const cardsRef = ref(database, `cards`);
      const cardsRes = await get(cardsRef);
      const cards = cardsRes.val();
      const cardsMatch = {};
      for (const { english, spanish, cardID } of Object.values(cards)) {
        if (
          english.toLowerCase().includes(keyword) ||
          spanish.toLowerCase().includes(keyword)
        ) {
          cardsMatch[cardID] = true;
        }
      }
      //sort deck in deckCards.length decending order for checking repeat deck in later codes
      const sortedDeck = Object.values(decks).sort(
        (a, b) => b.deckCards.length - a.deckCards.length
      );
      //cardsMatch contains cardID that match keyword
      //decks is decks the user do not have

      for (const deck of sortedDeck) {
        if (deck.deckName.toLowerCase().includes(keyword)) {
          const shallowCards = [...deck.deckCards];
          while (shallowCards.length) {
            const checkCardID = shallowCards.pop();
            if (!comparingCards[checkCardID]) {
              comparingCards[checkCardID] = true;
              resultInfoSet.add(deck);
            }
          }
        } else {
          let haveMatch = false;
          let isNew = false;
          const shallowCards = [...deck.deckCards];
          while (shallowCards.length) {
            const checkCardID = shallowCards.pop();
            if (cardsMatch[checkCardID]) {
              haveMatch = true;
            }
            if (!comparingCards[checkCardID]) {
              comparingCards[checkCardID] = true;
              isNew = true;
            }
          }
          if (haveMatch && isNew) {
            resultInfoSet.add(deck);
          }
          if (!haveMatch) {
            remainInfo.add(deck);
          }
        }
      }
      //randomly take 3 from remain
      const adviceInfo = [];
      const remainInfoArr = [...remainInfo];
      while (!remainInfoArr.length || adviceInfo.length < 3) {
        const randomIndex = Math.floor(Math.random() * remainInfoArr.length);
        adviceInfo.push(remainInfoArr[randomIndex]);
        remainInfoArr.splice(randomIndex, 1);
      }
      const resultInfo = [...resultInfoSet];
      //put cardInfo into each resultInfo&adviceInfo with new key cardInfos in each deck
      for (const deck of Object.values(resultInfo)) {
        deck.cardInfos = [];
        for (const cardID of deck.deckCards) {
          deck.cardInfos.push(cards[`card${cardID}`]);
        }
      }
      for (const deck of Object.values(adviceInfo)) {
        deck.cardInfos = [];
        for (const cardID of deck.deckCards) {
          deck.cardInfos.push(cards[`card${cardID}`]);
        }
      }
      return { resultInfo, adviceInfo };
    } catch (error) {
      this.setErrorMessage(error);
    }
  };

  //get user info and decks detail related to user
  //return { userInfo, userDecks }
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
  //no return
  putUserPicURL = async (url) => {
    const userPicRef = ref(database, `userInfo/${this.uid}/profilePic`);
    try {
      await set(userPicRef, url);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //delete deck from user
  //return every decks detail related to user
  deleteUserDeck = async (deckID) => {
    try {
      const userInfo = await this.getUserInfo(false);
      const userDeckIDs = userInfo.decks;
      const deleteDeckIndex = userDeckIDs.findIndex(
        (userDeckID) => userDeckID === deckID
      );
      //We want to keep the array structure, so using update instead of delete
      const newUserDeckIDs = userDeckIDs.toSpliced(deleteDeckIndex, 1);

      const userDeckIDsRef = ref(database, `userInfo/${this.uid}/decks`);
      await set(userDeckIDsRef, newUserDeckIDs);
      const decksPromise = newUserDeckIDs
        ? newUserDeckIDs.map(
            async (deckID) => await this.getDeckInfo(deckID, false)
          )
        : [];
      const newUserDecks = await Promise.all(decksPromise);
      return newUserDecks;
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //upload a new Card
  //no return
  postNewCard = async (card) => {
    const newCardRef = ref(database, `cards/card${card.cardID}`);
    try {
      await set(newCardRef, card);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //upload a new Deck
  //no return
  postNewDeck = async (deck) => {
    const newDeckRef = ref(database, `decks/deck${deck.deckID}`);
    try {
      await set(newDeckRef, deck);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //update user deck,newDeck will replace oldDeck in userInfo
  //deck is new Info with old deckID
  //no return
  postUserDecks = async (deck, deckName, cards) => {
    const userDeckRef = ref(database, `userInfo/${this.uid}/decks`);
    try {
      const newCards = [];
      const comparingDeck = await this.getDeckInfo(deck.deckID);
      const cardsPromises = comparingDeck.deckCards.map(
        async (cardID) => await this.getCardInfo(cardID, false)
      );
      //comparing cards order following deck.deckCardsID
      const comparingCardsRes = await Promise.all(cardsPromises);
      const comparingCards = comparingCardsRes.filter((card) => !!card);
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        //Checking for newCard
        const comparingCardIndex = comparingCards.findIndex(
          (comparingCard) => comparingCard.cardID === card.cardID
        );

        if (comparingCardIndex === -1) {
          newCards.push(card);
          continue;
        }
        //old Card with edited card
        const comparingCard = comparingCards[comparingCardIndex];
        if (
          card.english !== comparingCard.english ||
          card.spanish !== comparingCard.spanish
        ) {
          const genCardID = await axios.get(
            "https://www.uuidgenerator.net/api/version7"
          );
          const newCardID = genCardID.data;
          newCards.push({ ...card, cardID: newCardID });
          deck.deckCards[i] = newCardID;
        }
        //Need to deduce the comparing Card
        comparingCards.splice(comparingCardIndex, 1);
      }
      if (
        !newCards.length &&
        !comparingCards.length &&
        deckName === deck.deckName
      ) {
        //having comparingCards length means user have deleted cards
        //No new cards means the deck is the same as before
        //Deck name did not change
        return;
      }
      for (const card of newCards) {
        await this.postNewCard(card);
      }
      const genDeckID = await axios.get(
        "https://www.uuidgenerator.net/api/version7"
      );
      const newDeckID = genDeckID.data;
      //need to filter out empty array
      const newDeckCards = deck.deckCards.filter((cardID) => !!cardID);
      await this.postNewDeck({
        deckName: deckName,
        deckCards: newDeckCards,
        deckID: newDeckID,
      });
      const res = await get(userDeckRef);
      const userDeckIDs = res.val() ? res.val() : [];
      const deckIndex = userDeckIDs.findIndex(
        (deckID) => deckID === deck.deckID
      );
      userDeckIDs[deckIndex] = newDeckID;
      await set(userDeckRef, [...userDeckIDs]);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //add new user deck
  //no return
  putUserDecks = async (deckName, cards) => {
    try {
      const cardsPromises = cards.map(
        async (card) => await this.postNewCard(card)
      );
      await Promise.all(cardsPromises);
      const cardIDs = cards.map((card) => card.cardID);
      const genDeckID = await axios.get(
        "https://www.uuidgenerator.net/api/version7"
      );
      const newDeckID = genDeckID.data;
      const newDeck = {
        deckID: newDeckID,
        deckName: deckName,
        deckCards: cardIDs,
      };
      await this.postNewDeck(newDeck);
      const userDeckRef = ref(database, `userInfo/${this.uid}/decks`);
      const res = await get(userDeckRef);
      const userDeckIDs = res.val() ? res.val() : [];
      userDeckIDs.push(newDeckID);
      await set(userDeckRef, [...userDeckIDs]);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //add exiting deck to user
  //return ture means user already have this deck
  putExistingDeck = async (deckID) => {
    try {
      const userInfo = await this.getUserInfo();
      const userDeckIDs = userInfo.decks ? userInfo.decks : [];
      if (userDeckIDs.includes(deckID)) {
        return true;
      }
      userDeckIDs.push(deckID);
      const userDecksRef = ref(database, `userInfo/${this.uid}/decks`);
      await set(userDecksRef, userDeckIDs);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //add new user quiz report
  //return quizID
  putUserQuizReport = async (score, answer, choice) => {
    try {
      const userQuizList = await this.getUserQuizList();
      const quizID = userQuizList ? Object.values(userQuizList).length + 1 : 1;
      const newQuizReportRef = ref(
        database,
        `userInfo/${this.uid}/quizReport/quiz${quizID}`
      );
      const newQuizReport = {
        quizID: quizID,
        score: score,
        choice: choice,
        answer: answer,
        date: new Date().toLocaleDateString(),
      };
      await set(newQuizReportRef, newQuizReport);
      return quizID;
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };
}
