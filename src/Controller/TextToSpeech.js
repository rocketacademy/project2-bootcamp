import OpenAI from "openai";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default class TextToSpeech {
  constructor(setErrorMessage, setLoadingAudio, key) {
    this.setErrorMessage = setErrorMessage;
    this.setLoadingAudio = setLoadingAudio;
    this.openai = new OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true,
    });
  }

  //get audio from storage, if no such file, generate one from openAI
  playAudio = async (word) => {
    const audioRef = ref(storage, `audio/${word}`);
    try {
      const url = await getDownloadURL(audioRef);
      const audio = new Audio(url);
      audio.play();
      this.setLoadingAudio(false);
    } catch (error) {
      this.generateAudio(word, audioRef);
    }
  };

  //generate Audio from openAI
  generateAudio = async (word, audioRef) => {
    try {
      const mp3 = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: word,
        stream: true,
      });
      const arrayBuffer = await mp3.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      await uploadBytes(audioRef, blob);
      const url = await getDownloadURL(audioRef);
      const audio = new Audio(url);
      audio.play();
      this.setLoadingAudio(false);
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };
}
