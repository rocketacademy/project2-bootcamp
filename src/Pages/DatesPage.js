//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import { onChildAdded, ref, push, set, remove } from "firebase/database";

//-----------Components-----------//
import NavBar from "../Details/NavBar.js";
import DateForm from "../Components/Dates/DateForm.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

//-----------Media-----------//
import dates from "../Images/LogosIcons/word-icon-dates.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";
const REALTIME_DATABASE_KEY_ARCHIVE = "date-archive";

export default function DatesPage() {
  //context helper to send to database
  const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

  //create state to view date list
  const [dateList, setDateList] = useState([]);
  const [archiveList, setArchiveList] = useState([]);
  const [dateArchive, setDateArchive] = useState(false);

  useEffect(() => {
    //to view Date list
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );

    onChildAdded(dateListRef, (data) => {
      setDateList((state) => [...state, { key: data.key, val: data.val() }]);
    });

    //to view Archive list
    const archiveListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_ARCHIVE}`,
    );

    onChildAdded(archiveListRef, (data) => {
      setArchiveList((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [REALTIME_DATABASE_KEY_PAIRKEY]);

  // function to delete data from date list
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

  // function to delete data from date list
  const deleteArchiveItem = (dateItemKey) => {
    // Remove the item from local state
    const updatedArchiveList = archiveList.filter(
      (dateItem) => dateItem.key !== dateItemKey,
    );
    setDateList(updatedArchiveList);

    // Remove the item from Firebase
    remove(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_ARCHIVE}`,
      ),
    );
  };

  // Calculate number of days left
  const calculateDaysLeft = (targetDate) => {
    const currentDate = new Date();
    const registeredDate = new Date(targetDate);
    const timeDifference = registeredDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft;
  };

  // check and update if dates are done and send to archive
  useEffect(() => {
    // Check and update if dates are done and send to archive
    dateList.forEach((dateItem) => {
      const currentDate = new Date();
      const targetDate = new Date(dateItem.val.date);

      if (targetDate < currentDate) {
        // Date has passed, move to the archive
        const archiveRef = ref(
          database,
          `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_ARCHIVE}`,
        );

        // Push the entire dateItem to the archive
        const newArchiveItemRef = push(archiveRef);
        set(newArchiveItemRef, {
          id: dateItem.val.id,
          title: dateItem.val.title,
          items: dateItem.val.items,
          date: dateItem.val.date,
          time: dateItem.val.time,
        });

        // Remove the item from the current database
        remove(
          ref(
            database,
            `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}/${dateItem.key}`,
          ),
        );
      }
    });
  }, [dateList, REALTIME_DATABASE_KEY_PAIRKEY]);

  //function to toggle
  const toggleDateArchive = () => {
    setDateArchive(!dateArchive);
  };

  //function to view date or archive list
  const getListByName = (dateArchive) => {
    const listToDisplay = dateArchive ? archiveList : dateList;

    // Sorts by date
    const sortedList = Array.from(listToDisplay).sort((a, b) => {
      const daysLeftA = calculateDaysLeft(a.val.date);
      const daysLeftB = calculateDaysLeft(b.val.date);
      return daysLeftA - daysLeftB;
    });

    return sortedList;
  };

  return (
    <div className="flex min-h-screen flex-col justify-center  bg-background text-accent">
      <NavBar src={dates} />
      <main className="mt-[110px] flex flex-col items-center justify-start">
        {dateArchive === false ? (
          <div className="flex flex-row gap-3">
            <button className="rounded-xl bg-text px-5">Upcoming</button>
            <button
              className="rounded-xl bg-background px-5"
              onClick={toggleDateArchive}
            >
              Archive
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-3">
            <button
              className="rounded-xl bg-background px-5"
              onClick={toggleDateArchive}
            >
              Upcoming
            </button>
            <button className="rounded-xl bg-text px-5">Archive</button>
          </div>
        )}
        <div className="date-lists max-w-screen m-4 grid justify-center gap-4 p-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {getListByName(dateArchive).map((dateItem) => (
            <div
              key={dateItem.key}
              className=" m-[30px] flex w-[350px] flex-row items-start justify-between rounded-xl bg-text p-[10px]"
            >
              <div className="wrap flex items-start justify-between">
                <div className="group-for-days rounded-xl bg-background p-[20px]">
                  {dateArchive === false ? (
                    <>
                      <h1 className="text-center text-xl font-bold">
                        {calculateDaysLeft(dateItem.val.date)}
                      </h1>
                      <h2 className="font-bold">Days</h2>
                    </>
                  ) : (
                    <>
                      <h1 className="text-center text-xl font-bold">
                        {calculateDaysLeft(dateItem.val.date) * -1}
                      </h1>
                      <h2 className="text-center font-bold">
                        Days
                        <br />
                        Ago
                      </h2>
                    </>
                  )}
                </div>
                <div className="group-for-everythingelse ml-[10px]">
                  <h1 className="italic">
                    {dateItem.val.date}
                    <br />
                    {dateItem.val.time}
                  </h1>
                  <h1 className="font-bold">{dateItem.val.title}</h1>
                  {dateItem.val.items.map((item) => (
                    <div className="justify-left flex" key={item.id}>
                      <h1>-{item.title}</h1>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="ml-top"
                onClick={() =>
                  dateArchive
                    ? deleteArchiveItem(dateItem.key)
                    : deleteDateItem(dateItem.key)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
      <DateForm />
    </div>
  );
}
