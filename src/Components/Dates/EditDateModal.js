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
import Button from "../../Details/Button";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";

export default function EditDateModal({ dateKey }) {
  //create state to view date list on modal
  const [dateList, setDateList] = useState([]);

  //states for date form format
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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
      setStartTime(data[dateKey].startTime);
      setEndTime(data[dateKey].endTime);
      setId(data[dateKey].id);
    });
  }, [REALTIME_DATABASE_KEY_PAIRKEY, dateKey]);

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
      startTime: startTime,
      endTime: endTime,
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
    setStartTime("");
    setEndTime("");
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
    <div className=" rounded-md bg-background p-1 px-2 text-xs">
      <button
        onClick={() => {
          listDate(dateKey);
        }}
      >
        Edit
      </button>
      <dialog id={`edit-date-form-${dateKey}`} className="modal">
        <div className="modal-box flex flex-col items-center rounded-2xl bg-background">
          <form
            method="dialog"
            className="flex w-96 flex-col items-center justify-center p-[20px] text-accent"
          >
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 "
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            {title === "" ? (
              <label className="mb-[5px] text-red-600">Event: (Fill)</label>
            ) : (
              <label className="mb-[5px]">Event:</label>
            )}
            <input
              className="input mb-[15px] w-72 bg-white"
              type="text"
              name="title"
              value={title}
              placeholder={"What're yall doing?"}
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
                className="rounded-full bg-window p-3 font-black leading-[10px] shadow-lg hover:translate-y-[-2px] hover:bg-text"
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
              handleClick={() => updateData(dateKey)}
              disabled={items.length === 0}
            />
            <Button
              label="Delete"
              handleClick={() => deleteDateItem(dateKey)}
            />
          </form>
        </div>
      </dialog>
    </div>
  );
}
