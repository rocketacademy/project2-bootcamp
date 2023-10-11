import React, { useState } from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase/firebase";

const REALTIME_DATABASE_KEY_BUCKET = "bucket-list";

export default function BucketForm({ onSubmit, closeBucketFormModal }) {
  //State for bucketlist
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [date, setDate] = useState("");
  const [isDateSelected, setIsDateSelected] = useState(false);

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
      `dummypair/${REALTIME_DATABASE_KEY_BUCKET}`,
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
    onSubmit();
  };

  return (
    <form
      className="flex  w-96 w-full flex-col justify-center justify-items-center p-[20px] text-accent"
      onSubmit={(e) => {
        e.preventDefault();
        closeBucketFormModal();
      }}
    >
      <label className="mb-[5px]">Bucket :</label>
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
      <label className="mb-[5px]">Add your socks :</label>
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
          className="rounded-full bg-background px-[15px]"
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
      <div className="complete-date mt-[15px]">
        <input
          className="checkbox-for-date mr-[5px]"
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
        className="submit-btn my-[20px] rounded-full bg-background px-[15px]"
        onClick={writeData}
      >
        Submit
      </button>
    </form>
  );
}
