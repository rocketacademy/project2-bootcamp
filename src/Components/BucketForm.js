import React, { useState } from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase/firebase";

const REALTIME_DATABASE_KEY_BUCKET = "bucket-list";

export default function BucketForm({ onSubmit }) {
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
          id: Math.floor(Math.random() * 10000),
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
    const bucketListRef = ref(database, REALTIME_DATABASE_KEY_BUCKET);
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
    <div>
      <label>Bucket :</label>
      <input
        type="text"
        name="title"
        value={title}
        placeholder="Pick a title!"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <label>Add your socks :</label>
      <input
        type="text"
        name="newItem"
        value={newItem}
        placeholder="What you gonna do?"
        onChange={(e) => {
          setNewItem(e.target.value);
        }}
      />
      <br />
      <button onClick={handleSubmit}>Add</button>
      <ul>
        {items.map((items) => {
          return (
            <li key={items.id}>
              <label>{items.title}</label>
              <button onClick={() => deleteItem(items.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
      <input
        className="check-for-date"
        type="checkbox"
        checked={isDateSelected}
        onChange={() => setIsDateSelected(!isDateSelected)}
      />
      <label>Completion Date? :</label>
      <input
        type="date"
        className="mb-2 w-[10em] rounded-md border-[1px] border-black px-2"
        id="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
        disabled={!isDateSelected}
      />
      <br />
      <button className="bucket-button" onClick={writeData}>
        Submit
      </button>
    </div>
  );
}
