import React from "react";
import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App.js";
import BucketForm from "../Components/BucketForm.js";
import { database } from "../firebase/firebase";
import { onChildAdded, ref, update } from "firebase/database";

const REALTIME_DATABASE_KEY_BUCKET = "bucket-list";

export default function BucketListPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);

  //create state to view bucket list
  const [bucketList, setBucketList] = useState([]);
  const [showBucketForm, setShowBucketForm] = useState(false);

  //to view bucket list
  useEffect(() => {
    const bucketListRef = ref(database, REALTIME_DATABASE_KEY_BUCKET);

    onChildAdded(bucketListRef, (data) => {
      setBucketList((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);

  //create a toggle for checkbox
  const toggleCheckBox = (bucketItemKey, itemId) => {
    const updatedBucketList = bucketList.map((bucketItem) => {
      if (bucketItem.key === bucketItemKey) {
        const updatedItems = bucketItem.val.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });

        return {
          ...bucketItem,
          val: {
            ...bucketItem.val,
            items: updatedItems,
          },
        };
      }
      return bucketItem;
    });

    // Update the state and Firebase with the updated data
    setBucketList(updatedBucketList);

    // Update Firebase with the latest state data
    const updatedData = {
      [bucketItemKey]: {
        ...updatedBucketList.find((item) => item.key === bucketItemKey).val,
      },
    };
    update(ref(database, REALTIME_DATABASE_KEY_BUCKET), updatedData);
  };

  // Function to show the BucketForm
  const showBucketFormOnClick = () => {
    setShowBucketForm(true);
  };

  // Function to hide the BucketForm
  const hideBucketForm = () => {
    setShowBucketForm(false);
  };

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
          <NavLink to="/" className="text-[2em]">
            ←
          </NavLink>
          <p className="text-[2em]">Bucket List</p>
          {context.isLoggedIn ? (
            <p className="text-xs">Signed In</p>
          ) : (
            <p className="text-xs">Signed Out</p>
          )}
        </header>
        <main>
          <button onClick={showBucketFormOnClick}>Add a bucket</button>
          {showBucketForm && <BucketForm onSubmit={hideBucketForm} />}
          <div className="bucket-lists">
            {bucketList.map((bucketItem) => (
              <div key={bucketItem.key}>
                <div className="comment-container">
                  <h1>{bucketItem.val.title}</h1>
                  {bucketItem.val.items.map((item) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleCheckBox(bucketItem.key, item.id)}
                      />
                      <h2>{item.title}</h2>
                      {/* You can add more information about each item here */}
                    </div>
                  ))}
                  <h1>{bucketItem.val.items.title}</h1>
                  {bucketItem.val.date !== "" && (
                    <p>Date to complete! - {bucketItem.val.date}</p>
                  )}
                </div>
              </div>
            ))}
            <button>Add to mileStone</button>
          </div>
        </main>
      </div>
    </>
  );
}
