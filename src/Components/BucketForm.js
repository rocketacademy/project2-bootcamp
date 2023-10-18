//-----------React-----------//
import React, { useState } from "react";

//-----------Firebase-----------//
import { push, ref, set } from "firebase/database";
import { database } from "../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "./Helpers/ContextHelper";

//-----------Images-----------//
import post01 from "../Images/LogosIcons/post01.png";

const REALTIME_DATABASE_KEY_BUCKET = "bucket-list";

export default function BucketForm() {
  //State for bucketlist
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [date, setDate] = useState("");
  const [isDateSelected, setIsDateSelected] = useState(false);

  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create input to add more items with + button...
  const handleSubmit = (e) => {
    e.preventDefault();

    setItems((currentItem) => {
      return [
        ...currentItem,
        {
          id: new Date().getTime(),
          title: newItem,
          completed: false,
        },
      ];
    });
    setNewItem("");
  };

  //delete item
  const deleteItem = (id) => {
    setItems((currentItems) => {
      return currentItems.filter((items) => items.id !== id);
    });
  };

  //send data to database
  const writeData = () => {
    const bucketListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_BUCKET}`,
    );
    const newBucketRef = push(bucketListRef);

    set(newBucketRef, {
      title: title,
      items: items,
      date: date,
    });

    setTitle("");
    setItems([]);
    setNewItem("");
    setDate("");

    document.getElementById("bucket-form").close();
  };

  return (
    <div className=" fixed bottom-[20px] right-[20px] flex-row ">
      <button
        className="flex h-[2.5em] w-[2.5em] items-center justify-center rounded-full bg-window p-1 text-[28px] leading-none shadow-xl hover:translate-y-[-2px] hover:bg-text"
        onClick={() => {
          document.getElementById("bucket-form").showModal();
        }}
      >
        <img src={post01} alt="POST" />
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
            {title === "" ? (
              <label className="mb-[5px] text-red-600">*Bucket :</label>
            ) : (
              <label className="mb-[5px]">Bucket :</label>
            )}
            <input
              className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background  px-2"
              type="text"
              name="title"
              value={title}
              placeholder="Pick a title!"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            {items.length === 0 ? (
              <label className="mb-[5px] text-red-600">*Add your socks :</label>
            ) : (
              <label className="mb-[5px]">Add your socks :</label>
            )}
            <div className="input-button">
              <input
                className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background px-2"
                type="text"
                name="newItem"
                value={newItem}
                placeholder="What you gonna do?"
                onChange={(e) => {
                  setNewItem(e.target.value);
                }}
              />
              <button
                className="rounded-full bg-background px-[7px] font-black"
                onClick={handleSubmit}
              >
                +
              </button>
            </div>
            <ul>
              {items.map((items) => {
                return (
                  <li
                    key={items.id}
                    className="mb-[15px] flex justify-between  rounded-md bg-background px-2 py-1"
                  >
                    <label className="mr-[15px]">{items.title}</label>
                    <button onClick={() => deleteItem(items.id)}>Delete</button>
                  </li>
                );
              })}
            </ul>
            <div className="complete-date mt-[15px] ">
              <input
                className="checkbox-for-date mr-[5px] accent-accent"
                type="checkbox"
                checked={isDateSelected}
                onChange={() => setIsDateSelected(!isDateSelected)}
              />
              <label className="mr-[5px]">Completion Date? :</label>
              <input
                type="date"
                className="mb-2 w-[10em] rounded-md border-[1px] bg-background px-2"
                id="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                disabled={!isDateSelected}
              />
            </div>
            <button
              className="submit-btn my-[20px] w-20 rounded-full bg-background px-[15px] disabled:bg-neutral-500 disabled:text-background"
              onClick={writeData}
              disabled={items.length === 0}
            >
              Submit
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
