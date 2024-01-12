import { storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import OpenAI from "openai";
import LoadingButton from "@mui/lab/LoadingButton";

export default function TextToSpeech(props) {
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  // const handleAudioURLChange = async (cardID, audioURL) => {
  //   const newValueIndex = cards.findIndex((card) => card.cardID === cardID);
  //   const newCards = [...cards];
  //   newCards[newValueIndex] = {
  //     ...newCards[newValueIndex],
  //     URL: audioURL,
  //   };
  //   setCards(newCards);
  // };

  const handleTextToSpeech = async () => {
    try {
      setLoading(true);

      const spanishWord = props.card;
      console.log(spanishWord);

      const filePath = `audio/${Date.now()}`;
      const fileRef = storageRef(storage, filePath);

      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: `${spanishWord}`,
        stream: true,
      });

      const arrayBuffer = await mp3.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      await uploadBytes(fileRef, blob);

      const downloadURL = await getDownloadURL(fileRef);

      console.log(downloadURL);
      const spanishAudio = new Audio(downloadURL);
      setLoading(false);
      spanishAudio.play();

      props.onAudioURLChange(downloadURL);
    } catch (error) {
      console.error("Error text-to-speech", error);
    }
  };
  return (
    <div>
      <LoadingButton onClick={() => handleTextToSpeech()} loading={loading}>
        🔊
      </LoadingButton>
    </div>
  );
}
