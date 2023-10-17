//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import {
  ref,
  set,
  remove,
  orderByKey,
  get,
  query,
  startAt,
  limitToFirst,
} from "firebase/database";
import { database } from "../../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";

export default function EditDateModal({ dateKey }) {
  //create state to view date list on modal
  const [dateList, setDateList] = useState([]);

  //states for date form format
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //get data from firebase and put into dateList
  useEffect(() => {
    //to view Date list
    get(
      query(
        ref(
          database,
          `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
        ),
        orderByKey(),
        startAt(dateKey),
        limitToFirst(1),
      ),
    ).then((output) => {
      const data = output.val();

      // Update the state variables with data from dateList
      setTitle(data[dateKey].title);
      setItems(data[dateKey].items);
      setDate(data[dateKey].date);
      setTime(data[dateKey].time);
      setId(data[dateKey].id);
    });
  }, [REALTIME_DATABASE_KEY_PAIRKEY]);

  //create a function to store the data from database to other states
  const listDate = () => {
    setShowModal(true);
  };

  useEffect(() => {
    showModal &&
      document.getElementById(`edit-date-form-${dateKey}`).showModal();
  }, [showModal]);

  //create input to add more items with + button...
  const handleSubmit = (e) => {
    e.preventDefault();

    setItems((currentItem) => {
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

  //function to update data
  const updateData = (keyToUpdate) => {
    // Create a new entry to update
    const updatedDateItem = {
      id: id,
      title: title,
      items: items,
      date: date,
      time: time,
    };

    // Get a reference to the specific entry in the Firebase database
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}/${keyToUpdate}`,
    );

    // Update the entry in the database
    set(dateListRef, updatedDateItem);

    // Reset the form fields
    setTitle("");
    setItems([]);
    setNewItem("");
    setDate("");
    setTime("");
    setShowModal(false);

    document.getElementById(`edit-date-form-${dateKey}`).close();
  };

  // function to delete data from date list
  const deleteDateItem = (dateKey) => {
    // Remove the item from local state
    const updatedDateList = dateList.filter(
      (dateItem) => dateItem.key !== dateKey,
    );
    setDateList(updatedDateList);

    // Remove the item from Firebase
    remove(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}/${dateKey}`,
      ),
    );
  };

  return (
    <div className=" rounded-full bg-background p-[5px] px-[10px] text-xs">
      <button
        onClick={() => {
          listDate(dateKey);
        }}
      >
        Edit
      </button>
      <dialog id={`edit-date-form-${dateKey}`} className="modal">
        <div className="modal-box flex flex-col items-center rounded-2xl bg-text">
          <form method="dialog" className="flex flex-col p-[20px] text-accent">
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 "
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            {title === "" ? (
              <label className="mb-[5px] text-red-600">*Date :</label>
            ) : (
              <label className="mb-[5px]">Date :</label>
            )}
            <input
              className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background  px-2"
              type="text"
              name="title"
              value={title}
              placeholder={"What're yall doing?"}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            {items.length === 0 ? (
              <label className="mb-[5px] text-red-600">*Things needed :</label>
            ) : (
              <label className="mb-[5px]">Things needed :</label>
            )}
            <div className="input-button">
              <input
                className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background px-2"
                type="text"
                name="newItem"
                value={newItem}
                placeholder="What do you need to bring?"
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
              <label className="mr-[5px]">Time :</label>
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
              className="submit-btn my-[20px] rounded-full bg-background px-[15px] disabled:bg-neutral-500 disabled:text-background"
              disabled={items.length === 0}
              onClick={() => updateData(dateKey)}
            >
              Submit
            </button>
            <button
              className=" mt-[15px] rounded-full bg-background p-[5px]"
              onClick={() => deleteDateItem(dateKey)}
            >
              Delete
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
