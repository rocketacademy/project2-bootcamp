//-----------React-----------//
import React, { useState } from "react";

//-----------Firebase-----------//
import { push, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";
import Button from "../../Details/Button";
import CreateButton from "../Feed/CreateButton";

//-----------Media-----------//
import post02 from "../../Images/LogosIcons/post02.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";

export default function DateForm() {
  //State for date list
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create input to add more items with + button...
  const handleSubmit = (e) => {
    e.preventDefault();

    setItems((currentItem) => {
      console.log("handleSubmit");

      return [
        ...currentItem,
        {
          id: new Date().getTime(),
          title: newItem,
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
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );
    const newDateRef = push(dateListRef);

    set(newDateRef, {
      id: new Date().getTime(),
      title: title,
      items: items,
      startTime: startTime,
      endTime: endTime,
    });

    setTitle("");
    setItems([]);
    setNewItem("");
    setStartTime("");
    setEndTime("");

    document.getElementById("date-form").close();
  };

  return (
    <div className=" fixed bottom-[20px] right-[20px] flex-row ">
      <CreateButton
        src={post02}
        handleClick={() => {
          document.getElementById("date-form").showModal();
        }}
      />
      <dialog id="date-form" className="modal">
        <div className="modal-box flex flex-col items-center rounded-2xl bg-background">
          <form
            method="dialog"
            className="flex w-96 flex-col items-center justify-center p-[20px] text-accent"
          >
            <button className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 ">
              ✕
            </button>
            {/* Event Details Section */}
            {title === "" ? (
              <label className="mb-[5px] text-red-600">Event: (Fill)</label>
            ) : (
              <label className="mb-[5px]">Event:</label>
            )}
            <input
              className="input mb-[15px] mr-[15px] w-72 bg-white"
              type="text"
              name="title"
              value={title}
              placeholder="What're yall doing?"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            {items.length === 0 ? (
              <label className="mb-[5px] text-red-600">Checklist: (Fill)</label>
            ) : (
              <label className="mb-[5px]">Checklist:</label>
            )}
            <div className="input-button">
              <input
                className="input mb-[15px] mr-[15px] w-64 rounded-md bg-white px-2"
                type="text"
                name="newItem"
                value={newItem}
                placeholder="What do you need to bring?"
                onChange={(e) => {
                  setNewItem(e.target.value);
                }}
              />
              <button
                className="rounded-full bg-window p-3 font-black leading-[12px] shadow-lg hover:translate-y-[-2px] hover:bg-text"
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
                    className="mb-[5px] flex w-72 justify-between rounded-md bg-window px-2 text-sm hover:translate-y-[-2px] hover:bg-text"
                  >
                    <label className="mr-[15px]">{items.title}</label>
                    <button
                      onClick={() => deleteItem(items.id)}
                      className="text-sm hover:font-semibold"
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
            {/* Event Timings Section */}
            <label>Start Time</label>
            <input
              className="input mb-1 bg-white"
              type="datetime-local"
              name="startTime"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
            <label>End Time</label>

            <input
              className="input mb-1 bg-white"
              type="datetime-local"
              name="endTime"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
            <Button
              label="Submit"
              handleClick={writeData}
              disabled={
                ![items, title, startTime, endTime].every(
                  (field) => field.length > 0,
                )
              }
            />
          </form>
        </div>
      </dialog>
    </div>
  );
}
