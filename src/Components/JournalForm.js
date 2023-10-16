//-----------React-----------//
import React, { useState } from "react";

//-----------Firebase-----------//
import { push, ref, set } from "firebase/database";
import { database } from "../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "./Helpers/ContextHelper";

//-----------Images-----------//
import Angry from "../Images/LogosIcons/emo-angry.png";
import Confused from "../Images/LogosIcons/emo-confused.png";
import Happy from "../Images/LogosIcons/emo-happy.png";
import Sad from "../Images/LogosIcons/emo-sad.png";
import Sick from "../Images/LogosIcons/emo-sick.png";
import Yuck from "../Images/LogosIcons/emo-yuck.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_JOURNAL = "Journal-list";

export default function JournalForm() {
  //State for journal list
  const [title, setTitle] = useState("");
  const [texts, setTexts] = useState("");
  const [date, setDate] = useState("");
  const Emotions = [Angry, Confused, Happy, Sad, Sick, Yuck];

  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //send data to database
  const writeData = () => {
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_JOURNAL}`,
    );
    const newDateRef = push(dateListRef);

    set(newDateRef, {
      id: new Date().getTime(),
      title: title,
      texts: texts,
      date: date,
    });

    setTitle("");
    setTexts("");
    setDate("");

    document.getElementById("date-form").close();
  };

  return (
    <div className=" fixed bottom-[20px] right-[20px] flex-row ">
      <button
        className="btn w-[10em] bg-text"
        onClick={() => {
          document.getElementById("date-form").showModal();
        }}
      >
        Jolt a post
      </button>
      <dialog id="date-form" className="modal">
        <div className="modal-box flex flex-col items-center rounded-2xl bg-text">
          <form
            method="dialog"
            className="flex  w-96 w-full flex-col justify-center justify-items-center p-[20px] text-accent"
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
            <div className="input-button">
              <textarea
                maxLength="400"
                className="textarea-bordered w-[15em] rounded-md bg-background px-2"
                name="texts"
                value={texts}
                placeholder="thoughts"
                onChange={(e) => {
                  setTexts(e.target.value);
                }}
              />
            </div>
            <button
              className="submit-btn my-[20px] rounded-full bg-background px-[15px] "
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
