import axios from "axios";

export default class Translator {
  constructor(setErrorMessage, key) {
    this.setErrorMessage = setErrorMessage;
    this.apiKey = key;
    this.URL = `https://www.dictionaryapi.com/api/v3/references/spanish/json/`;
  }

  removeColon = (word) => {
    if (word && word.includes(":")) word = word.split(":")[1];
    return word;
  };

  //input english word
  //return String[], (translation)
  engToSpan = async (eng) => {
    const apiURL = this.URL + eng + `?key=` + this.apiKey;
    try {
      const res = await axios.get(apiURL);
      const datas = res.data;
      if (!Array.isArray(datas) || !datas.length) {
        throw new Error("No Translation found.");
      }
      const translation = [];
      for (const data of datas) {
        //We need to know it is eng
        if (data.meta.lang !== "en") continue;
        // const form = data.fl;
        for (const word of data.shortdef) {
          const shortWord = this.removeColon(word);
          translation.push(shortWord);
        }
      }
      if (!translation.length) {
        throw new Error("No Translation found.");
      }
      return translation;
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };

  //input spanish word
  //return String[], (form : translation)
  spanToEng = async (span) => {
    const apiURL = this.URL + span + `?key=` + this.apiKey;
    try {
      const res = await axios.get(apiURL);
      const datas = res.data;
      if (!Array.isArray(datas) || !datas.length) {
        throw new Error("No Translation found.");
      }
      const translation = [];
      for (const data of datas) {
        //We need to know it is eng
        if (data.meta.lang !== "es") continue;
        // const form = data.fl;
        for (const word of data.shortdef) {
          const shortWord = this.removeColon(word);
          translation.push(shortWord);
        }
      }
      if (!translation.length) {
        throw new Error("No Translation found.");
      }
      return translation;
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };
}
