//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import { onChildAdded, ref, update, remove } from "firebase/database";

//-----------Components-----------//
import BucketForm from "../Components/BucketForm.js";
import NavBar from "../Details/NavBar.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";
import CreateButton2 from "../Components/Feed/CreateButton2";
import MemoryComposer from "../Components/Feed/MemoryComposer";

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

  //create a toggle for line across texts
  const toggleLineOnText = (bucketItemKey, itemId) => {
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
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_BUCKET}//${bucketItemKey}`,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar src={BucketListImage} />
      <main className="mt-[110px] flex flex-col items-center justify-start">
        <div className="bucket-lists max-w-screen m-4 grid justify-center gap-4 p-3 md:grid-cols-1 lg:grid-cols-3">
          {bucketList.map((bucketItem) => (
            <div
              key={bucketItem.key}
              className="m-[30px] flex w-[300px] flex-col rounded-xl bg-window p-[20px] shadow-lg hover:translate-y-[-2px]"
            >
              <button
                className="ml-auto rounded-md bg-background px-[5px]"
                onClick={() =>
                  document
                    .getElementById(`delete-bucket-modal-${bucketItem.key}`)
                    .showModal()
                }
              >
                Delete
              </button>
              <dialog
                id={`delete-bucket-modal-${bucketItem.key}`}
                className="modal "
              >
                <div className="modal-box flex-col justify-center bg-background p-[20px] text-center">
                  <form method="dialog">
                    <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                      ✕
                    </button>
                    <h3 className="text-lg font-bold">
                      Are you sure you want to delete this list?
                    </h3>
                    <button
                      className="btn m-[20px] bg-red-700 text-white hover:bg-red-900"
                      onClick={() => deleteBucketItem(bucketItem.key)}
                    >
                      Confirm
                    </button>
                  </form>
                </div>
              </dialog>
              <h1 className="mt-[5px] rounded-md bg-text pl-[5px] text-center text-[18px] font-bold">
                {bucketItem.val.title}
              </h1>
              {bucketItem.val.items.map((item) => (
                <h2
                  className="cursor-pointer"
                  key={item.id}
                  style={{
                    textDecoration: item.completed ? "line-through" : "none",
                  }}
                  onClick={() => toggleLineOnText(bucketItem.key, item.id)}
                >
                  {item.title}
                </h2>
              ))}
              <h1>{bucketItem.val.items.title}</h1>
              <hr className="my-[10px] rounded-full border-[1.5px] border-accent" />
              {bucketItem.val.date !== "" ? (
                <p className="mb-[10px]">
                  Date to complete! - {bucketItem.val.date}
                </p>
              ) : (
                <p></p>
              )}
              <div className="ml-auto translate-x-2 translate-y-2">
                <CreateButton2
                  handleClick={() =>
                    document
                      .getElementById(`composer-${bucketItem.key}`)
                      .showModal()
                  }
                />
                <dialog id={`composer-${bucketItem.key}`} className="modal">
                  <div className="modal-box bg-background">
                    <form method="dialog">
                      <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                        ✕
                      </button>
                    </form>

                    <MemoryComposer
                      id={bucketItem.key}
                      uploadMessage={bucketItem.val.title}
                      uploadDate={bucketItem.val.endTime}
                      uploadTags="bucket-list"
                    />
                  </div>
                </dialog>
              </div>
            </div>
          ))}
          <BucketForm />
        </div>
      </main>
    </div>
  );
}
