//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import { onChildAdded, ref, update, remove } from "firebase/database";

//-----------Components-----------//
import BucketForm from "../Components/BucketForm.js";
import NavBar from "../Details/NavBar.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

//-----------Media-----------//
import BucketListImage from "../Images/LogosIcons/word-icon-bucketlist.png";

//Database key for bucket-list
const REALTIME_DATABASE_KEY_BUCKET = "bucket-list";

export default function BucketListPage() {
  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create state to view bucket list
  const [bucketList, setBucketList] = useState([]);

  //to view bucket list
  useEffect(() => {
    const bucketListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_BUCKET}`,
    );

    onChildAdded(bucketListRef, (data) => {
      setBucketList((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [REALTIME_DATABASE_KEY_PAIRKEY]);

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
    update(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_BUCKET}`,
      ),
      updatedData,
    );
  };

  // function to delete data
  const deleteBucketItem = (bucketItemKey) => {
    // Remove the item from local state
    const updatedBucketList = bucketList.filter(
      (bucketItem) => bucketItem.key !== bucketItemKey,
    );
    setBucketList(updatedBucketList);

    // Remove the item from Firebase
    remove(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_BUCKET}`,
      ),
    );
  };

  //send to milestone

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar label="" src={BucketListImage} />
      <main className="mt-[110px]">
        <div className="bucket-lists max-w-screen s:grid-cols-1 m-4 grid justify-center gap-4 p-3 sm:grid-cols-2 md:grid-cols-4">
          {bucketList.map((bucketItem) => (
            <div
              key={bucketItem.key}
              className="m-[30px] flex w-[275px] flex-col rounded-xl bg-text p-[20px] "
            >
              <button
                className="ml-auto"
                onClick={() => deleteBucketItem(bucketItem.key)}
              >
                Delete
              </button>
              <h1 className="text-[18px] font-bold">{bucketItem.val.title}</h1>
              {bucketItem.val.items.map((item) => (
                <div className="justify-left flex py-[5px]" key={item.id}>
                  <input
                    className="mr-[10px] accent-accent"
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleCheckBox(bucketItem.key, item.id)}
                  />
                  <h2>{item.title}</h2>
                </div>
              ))}
              <h1>{bucketItem.val.items.title}</h1>
              {bucketItem.val.date !== "" ? (
                <p className="mb-[10px]">
                  Date to complete! - {bucketItem.val.date}
                </p>
              ) : (
                <p className="mb-[10px]"></p>
              )}
              <button className="rounded-full bg-background px-[20px] py-[5px]">
                Add to Memories
              </button>
            </div>
          ))}
          <BucketForm />
        </div>
      </main>
    </div>
  );
}
