import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App.js";
import BucketForm from "../Components/BucketForm.js";
import { database } from "../firebase/firebase";
import { onChildAdded, ref, update, remove } from "firebase/database";
import BucketListImage from "../Images/LogosIcons/word-icon-bucketlist.png";
import NavBar from "../Details/NavBar.js";

const REALTIME_DATABASE_KEY_BUCKET = "bucket-list";

export default function BucketListPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);

  //create state to view bucket list
  const [bucketList, setBucketList] = useState([]);

  //to view bucket list
  useEffect(() => {
    const bucketListRef = ref(
      database,
      `dummypair/${REALTIME_DATABASE_KEY_BUCKET}`,
    );

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
    update(
      ref(database, `dummypair/${REALTIME_DATABASE_KEY_BUCKET}`),
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
        `dummypair/${REALTIME_DATABASE_KEY_BUCKET}/${bucketItemKey}`,
      ),
    );
  };

  //modal close button
  const closeBucketFormModal = () => {
    const modal = document.getElementById("bucket-form");
    modal.close();
  };

  //send to milestone

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar label="" src={BucketListImage} />
      <main className="mt-[110px]">
        <div className="flex justify-center">
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
              <form method="dialog">
                <button className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 ">
                  ✕
                </button>
              </form>
              <BucketForm closeBucketFormModal={closeBucketFormModal} />
            </div>
          </dialog>
        </div>
        <div className="bucket-lists max-w-screen m-4 grid w-full grid-cols-2 gap-4  p-3 md:grid-cols-4">
          {bucketList.map((bucketItem) => (
            <div
              key={bucketItem.key}
              className="m-[20px] flex flex-col rounded-xl bg-text p-[20px] "
            >
              <button
                className="ml-auto"
                onClick={() => deleteBucketItem(bucketItem.key)}
              >
                Delete
              </button>
              <h1 className="">{bucketItem.val.title}</h1>
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
        </div>
      </main>
    </div>
  );
}
