import { storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import OpenAI from "openai";
import { Button } from "@mui/material";

export default function TextToSpeech(props) {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
  const handleTextToSpeech = async () => {
    const spanishWord = props.card.spanish;
    console.log(spanishWord);
    const filePath = `audio/${Date.now()}`;
    const fileRef = storageRef(storage, filePath);

    try {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: `${spanishWord}`,
      });
      const arrayBuffer = await mp3.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      console.log(downloadURL);
      const spanishAudio = new Audio(downloadURL);
      spanishAudio.play();

      props.onAudioURLChange(downloadURL);
    } catch (error) {
      console.error("Error text-to-speech", error);
    }
  };
  return <Button onClick={() => handleTextToSpeech()}>🔊</Button>;
}
