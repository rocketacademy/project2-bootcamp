//-----------React-----------//
import React, { useState } from "react";

//-----------Firebase-----------//
import { push, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";
import EmotionComponent from "./EmotionComponent";

import Happy from "../../Images/LogosIcons/emo-happy.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_JOURNAL = "Journal-list";

export default function JournalForm() {
  //State for journal list
  const [title, setTitle] = useState("");
  const [texts, setTexts] = useState("");
  const [date, setDate] = useState("");
  const [sign, setSign] = useState("");
  const [emotion, setEmotion] = useState(Happy);

  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //set emotion
  const handleEmotionSelect = (selectedEmotion) => {
    setEmotion(selectedEmotion);
  };

  //send data to database
  const writeData = () => {
    const journalListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_JOURNAL}`,
    );
    const newJournaleRef = push(journalListRef);

    set(newJournaleRef, {
      id: new Date().getTime(),
      title: title,
      texts: texts,
      date: date,
      emotion: emotion,
      sign: sign,
    });

    setTitle("");
    setTexts("");
    setDate("");
    setSign("");
    setEmotion(Happy);

    document.getElementById("journal-form").close();
  };

  return (
    <div className=" fixed bottom-[20px] right-[20px] flex-row ">
      <button
        className="btn w-[10em] bg-text"
        onClick={() => {
          document.getElementById("journal-form").showModal();
        }}
      >
        Jolt a post
      </button>
      <dialog id="journal-form" className="modal">
        <div className="modal-box flex flex-col items-center rounded-2xl bg-text">
          <form
            method="dialog"
            className="flex  w-full flex-col justify-center justify-items-center p-[20px] text-accent"
          >
            <button className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 ">
              ✕
            </button>
            <label className="mb-[5px]">Title :</label>
            <input
              className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background  px-2"
              type="text"
              name="title"
              value={title}
              placeholder="Journal Headline"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <div className="date-for-date mt-[15px]">
              <label className="mr-[5px]">Date :</label>
              <input
                type="date"
                className="mb-[15px] w-[10em] rounded-md border-[1px] bg-background px-2"
                id="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <label className="mb-[5px]">Entry :</label>
            <textarea
              maxLength="400"
              className="textarea-bordered mb-[5px] w-80 w-[15em] rounded-md bg-background px-2"
              name="texts"
              value={texts}
              placeholder="thoughts"
              onChange={(e) => {
                setTexts(e.target.value);
              }}
            />
            <div className="flex flex-row">
              <div className="flex flex-col">
                <label className="mb-[5px]">Signing Off :</label>
                <input
                  className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background  px-2"
                  type="text"
                  name="sign"
                  value={sign}
                  placeholder="sign off"
                  onChange={(e) => {
                    setSign(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-[-5px]">Feeling?</label>
                <EmotionComponent onSelect={handleEmotionSelect} />
              </div>
            </div>
            <button
              className="submit-btn my-[20px] w-20 rounded-full bg-background px-[15px] "
              onClick={writeData}
            >
              Submit
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
