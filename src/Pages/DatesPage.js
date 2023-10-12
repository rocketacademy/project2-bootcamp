//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import { onChildAdded, ref, update, remove } from "firebase/database";

//-----------Components-----------//
import NavBar from "../Details/NavBar.js";
import DateForm from "../Components/Dates/DateForm.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

//-----------Media-----------//
import dates from "../Images/LogosIcons/word-icon-dates.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";

export default function DatesPage() {
  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create state to view date list
  const [dateList, setDateList] = useState([]);

  //to view Date list
  useEffect(() => {
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );

    onChildAdded(dateListRef, (data) => {
      setDateList((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [REALTIME_DATABASE_KEY_PAIRKEY]);

  // function to delete data
  const deleteDateItem = (dateItemKey) => {
    // Remove the item from local state
    const updatedDateList = dateList.filter(
      (dateItem) => dateItem.key !== dateItemKey,
    );
    setDateList(updatedDateList);

    // Remove the item from Firebase
    remove(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
      ),
    );
  };

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center bg-background">
        <NavBar src={dates} />
        <main className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-3">
            <button className="px-2 hover:bg-slate-300">Upcoming</button>
            <button className="px-2 hover:bg-slate-300">Archive</button>
          </div>
          <DateForm />
        </main>
      </div>
    </>
  );
}
