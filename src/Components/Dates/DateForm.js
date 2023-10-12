import React, { useState } from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import ContextHelper from "../Helpers/ContextHelper";

const REALTIME_DATABASE_KEY_DATE = "date-list";

export default function DateForm() {
  //State for date list
  const [title, setTitle] = useState("");
  const [items, setItems] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //send data to database
  const writeData = () => {
    const bucketListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );
    const newBucketRef = push(bucketListRef);

    set(newBucketRef, {
      title: title,
      items: items,
      date: date,
      time: time,
    });

    setTitle("");
    setItems("");
    setDate("");
    setTime("");
  };

  return (
    <>
      <div className="absolute bottom-[10px] right-[10px] m-[10px]">
        <button
          className="btn w-[10em] bg-text"
          onClick={() => {
            document.getElementById("bucket-form").showModal();
          }}
        >
          Add a bucket
        </button>
        <dialog id="bucket-form" className="modal">
          <div className="modal-box flex flex-col items-center rounded-2xl bg-text">
            <form
              method="dialog"
              className="flex  w-96 w-full flex-col justify-center justify-items-center p-[20px] text-accent"
            >
              <button className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 ">
                ✕
              </button>
              <label className="mb-[5px]">Date :</label>
              <input
                className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background  px-2"
                type="text"
                name="title"
                value={title}
                placeholder="What're yall doing?"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <label className="mb-[5px]">Things needed :</label>
              <div className="input-button">
                <input
                  className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background px-2"
                  type="text"
                  name="items"
                  value={items}
                  placeholder="What do you need to bring?"
                  onChange={(e) => {
                    setItems(e.target.value);
                  }}
                />
              </div>
              <div className="date-for-date mt-[15px]">
                <label className="mr-[5px]">Date for date :</label>
                <input
                  type="date"
                  className="mb-2 w-[10em] rounded-md border-[1px] bg-background px-2"
                  id="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>
              <div className="time mt-[15px]">
                <label className="mr-[5px]">Date for date :</label>
                <input
                  type="time"
                  className="mb-2 w-[10em] rounded-md border-[1px] bg-background px-2"
                  id="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                />
              </div>
              <button
                className="submit-btn my-[20px] rounded-full bg-background px-[15px]"
                onClick={writeData}
              >
                Submit
              </button>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
}
