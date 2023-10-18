//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import { onChildAdded, ref, remove } from "firebase/database";

//-----------Components-----------//
import JournalForm from "../Components/Journal/JournalForm.js";
import NavBar from "../Details/NavBar.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

//-----------Media-----------//
import JournalImage from "../Images/LogosIcons/word-icon-journal.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_JOURNAL = "Journal-list";

export default function JournalListPage() {
  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create state to view bucket list
  const [journalList, setJournalList] = useState([]);

  //to view journal list
  useEffect(() => {
    const journalListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_JOURNAL}`,
    );

    onChildAdded(journalListRef, (data) => {
      setJournalList((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [REALTIME_DATABASE_KEY_PAIRKEY]);

  // function to delete data
  const deleteJournalItem = (journalItemKey) => {
    // Remove the item from local state
    const updatedJournalList = journalList.filter(
      (journalItem) => journalItem.key !== journalItemKey,
    );
    setJournalList(updatedJournalList);

    // Remove the item from Firebase
    remove(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_JOURNAL}/${journalItemKey}`,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar src={JournalImage} />
      <main className="mt-[110px] flex flex-col items-center justify-start">
        <div className="bucket-lists max-w-screen m-4 grid justify-center gap-4 p-3 md:grid-cols-1 lg:grid-cols-3">
          {journalList.map((journalItem) => (
            <div
              key={journalItem.key}
              className="m-[30px] flex w-[350px] flex-col rounded-xl bg-window p-[20px] shadow-lg hover:translate-y-[-2px]"
            >
              <button
                className=" z-10 ml-auto"
                onClick={() =>
                  document
                    .getElementById(`delete-bucket-modal-${journalItem.key}`)
                    .showModal()
                }
              >
                Delete
              </button>
              <dialog
                id={`delete-bucket-modal-${journalItem.key}`}
                className="modal "
              >
                <div className="modal-box flex-col justify-center bg-text p-[20px] text-center">
                  <form method="dialog">
                    <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                      ✕
                    </button>
                    <h3 className="text-lg font-bold">
                      Are you sure you want to delete this list?
                    </h3>
                    <button
                      className="btn m-[20px] bg-red-700 text-white hover:bg-red-900"
                      onClick={() => deleteJournalItem(journalItem.key)}
                    >
                      Confirm
                    </button>
                  </form>
                </div>
              </dialog>
              <img
                className="mt-[-25px] w-[3em] rounded-xl bg-background"
                src={journalItem.val.emotion}
                alt={journalItem.val.emotion}
              />
              <h1 className="my-[15px] rounded-md bg-text pl-[5px] text-center text-[18px] font-bold">
                {journalItem.val.title}
              </h1>
              <h1>{journalItem.val.texts}</h1>
              {journalItem.val.sign === "" ? (
                <></>
              ) : (
                <h1>- {journalItem.val.sign}</h1>
              )}
              <hr className="my-[10px] rounded-full border-[1.5px] border-black" />
              <p className="mb-[10px]">{journalItem.val.date}</p>
            </div>
          ))}
          <JournalForm />
        </div>
      </main>
    </div>
  );
}
