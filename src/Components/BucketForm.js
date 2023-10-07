import React, { useState, useContext } from "react";
import { push, ref, set } from "firebase/database";
import { realTimeDatabase } from "../firebase/firebase";
import { render } from "react-dom";

const REALTIME_DATABASE_KEY_BUCKET = "bucket-list";

export default function BucketForm() {
  //State for bucketlist
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

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

  //create a toggle for checkbox
  const toggleItems = (id, completed) => {
    setItems((currentItems) => {
      return currentItems.map((items) => {
        if (items.id === id) {
          return { ...items, completed };
        }

        return items;
      });
    });
  };

  //delete item
  const deleteItem = (id) => {
    setItems((currentItems) => {
      return currentItems.filter((items) => items.id !== id);
    });
  };

  return (
    <div>
      <label>Bucket:</label>
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
      <label>Add your socks:</label>
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
              <label>
                <input
                  type="checkbox"
                  checked={items.completed}
                  onChange={(e) => toggleItems(items.id, e.target.checked)}
                />
                {items.title}
              </label>
              <button onClick={() => deleteItem(items.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
