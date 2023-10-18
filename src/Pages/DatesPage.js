//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import {
  onChildAdded,
  ref,
  push,
  set,
  remove,
  onChildChanged,
  onChildRemoved,
  off,
} from "firebase/database";

//-----------Components-----------//
import NavBar from "../Details/NavBar.js";
import DateForm from "../Components/Dates/DateForm.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";
import EditDateModal from "../Components/Dates/EditDateModal.js";
import CreateButton2 from "../Components/Feed/CreateButton2";
import MemoryComposer from "../Components/Feed/MemoryComposer";

//-----------Media-----------//
import dates from "../Images/LogosIcons/word-icon-dates.png";
import CalendarButton from "../Components/Dates/CalendarButton";

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

  const [eventDetails, setEventDetails] = useState({
    startTime: "",
    endTime: "",
    summary: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    //to view Date list
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );

    const dateListCallback = (data) => {
      setDateList((state) => [...state, { key: data.key, val: data.val() }]);
    };

    onChildAdded(dateListRef, dateListCallback);
    onChildChanged(dateListRef, dateListCallback);
    onChildRemoved(dateListRef, (data) => {
      // Remove the item from the list
      setDateList((state) => state.filter((item) => item.key !== data.key));
    });

    //to view Archive list
    const archiveListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_ARCHIVE}`,
    );

    const archiveListCallback = (data) => {
      setArchiveList((state) => [...state, { key: data.key, val: data.val() }]);
    };

    onChildAdded(archiveListRef, archiveListCallback);
    onChildChanged(archiveListRef, archiveListCallback);
    onChildRemoved(archiveListRef, (data) => {
      // Remove the item from the list
      setArchiveList((state) => state.filter((item) => item.key !== data.key));
    });
    // Clean up the listeners when the component unmounts
    return () => {
      off(dateListRef, dateListCallback);
      off(archiveListRef, archiveListCallback);
    };
  }, [REALTIME_DATABASE_KEY_PAIRKEY]);

  // function to delete data from date list
  const deleteArchiveItem = (dateItemKey) => {
    // Remove the item from local state
    const updatedArchiveList = archiveList.filter(
      (dateItem) => dateItem.key !== dateItemKey,
    );
    setArchiveList(updatedArchiveList);

    // Remove the item from Firebase
    remove(
      ref(
        database,
        `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_ARCHIVE}/${dateItemKey}`,
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

  const formattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // check and update if dates are done and send to archive
  useEffect(() => {
    // Check and update if dates are done and send to archive
    dateList.forEach((dateItem) => {
      const currentDate = new Date();
      const targetDate = new Date(dateItem.val.endTime);

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
          startTime: dateItem.val.startTime,
          endTime: dateItem.val.endTime,
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
              className="rounded-xl bg-background px-5 hover:bg-window"
              onClick={toggleDateArchive}
            >
              Archive
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-3">
            <button
              className="rounded-xl bg-background px-5 hover:bg-window"
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
              className=" m-[30px] flex w-[360px] flex-row items-start justify-between rounded-xl bg-window p-[10px] shadow-lg hover:translate-y-[-2px]"
            >
              <div className="flex items-start justify-between">
                {/* Days Section */}
                <section className="flex w-[80px] flex-col items-center justify-center">
                  <div className="flex h-[70px] w-full flex-col items-center justify-center rounded-xl bg-background">
                    {dateArchive === false ? (
                      <>
                        <h1 className="text-center text-xl font-bold">
                          {calculateDaysLeft(dateItem.val.startTime)}
                        </h1>
                        <h2 className="text-center text-sm font-bold">Days</h2>
                      </>
                    ) : (
                      <>
                        <h1 className="text-center text-xl font-bold">
                          {calculateDaysLeft(dateItem.val.startTime) * -1}
                        </h1>
                        <h2 className="text-center text-sm font-bold">
                          Days Ago
                        </h2>
                      </>
                    )}
                  </div>
                  <h1 className="m-1 w-full rounded-md bg-text px-2 text-center text-[10px]">
                    {formattedDate(dateItem.val.startTime)} to
                    <br />
                    {formattedDate(dateItem.val.endTime)}
                  </h1>
                </section>
                {/* Date information section */}
                <div className="ml-[10px] w-[190px]">
                  <h1 className="w-full rounded-md bg-text px-2 font-bold">
                    {dateItem.val.title}
                  </h1>
                  {dateItem.val.items.map((item) => (
                    <div className="justify-left flex" key={item.id}>
                      <h1>- {item.title}</h1>
                    </div>
                  ))}
                </div>
              </div>
              <section className="ml-2 flex h-[140px] w-[60px] flex-col justify-between">
                <div className="flex-col text-center">
                  {dateArchive ? (
                    <button
                      className="ml-1 rounded-md bg-background p-1 text-xs"
                      onClick={() => deleteArchiveItem(dateItem.key)}
                    >
                      Delete
                    </button>
                  ) : (
                    <EditDateModal dateKey={dateItem.key} />
                  )}
                </div>
                <div className="translate-x-[17px] translate-y-7">
                  <CalendarButton
                    key={dateItem.key}
                    title={dateItem.val.title}
                    description={dateItem.val.items}
                    startTime={dateItem.val.startTime}
                    endTime={dateItem.val.endTime}
                    location="placeholder"
                  />
                </div>

                <div className="translate-x-2 translate-y-2">
                  <CreateButton2
                    handleClick={() =>
                      document
                        .getElementById(`composer-${dateItem.key}`)
                        .showModal()
                    }
                  />
                  <dialog id={`composer-${dateItem.key}`} className="modal">
                    <div className="modal-box bg-background">
                      <form method="dialog">
                        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                          ✕
                        </button>
                      </form>

                      <MemoryComposer
                        id={dateItem.key}
                        uploadMessage={dateItem.val.title}
                        uploadDate={dateItem.val.endTime}
                        uploadTags="dates"
                      />
                    </div>
                  </dialog>
                </div>
              </section>
            </div>
          ))}
        </div>
      </main>
      <DateForm />
    </div>
  );
}
