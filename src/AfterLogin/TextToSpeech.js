import { storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import OpenAI from "openai";
import { Button } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export default function TextToSpeech(props) {
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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
