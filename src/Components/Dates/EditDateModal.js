//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { ref, onChildAdded, set } from "firebase/database";
import { database } from "../../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";
const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

export default function EditDateModal() {
  //create state to view date list on modal
  const [dateList, setDateList] = useState([]);

  //states for date form format
  const [title, setTitle] = useState(`${dateList.title}`);
  const [items, setItems] = useState(`${dateList.items}`);
  const [newItem, setNewItem] = useState("");
  const [date, setDate] = useState(`${dateList.date}`);
  const [time, setTime] = useState(`${dateList.time}`);

  useEffect(() => {
    //to view Date list
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}`,
    );

    onChildAdded(dateListRef, (data) => {
      setDateList((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);

  //create input to add more items with + button...
  const handleSubmit = (e) => {
    e.preventDefault();

    setItems((currentItem) => {
      return [
        ...currentItem,
        {
          id: new Date().getTime(),
          title: newItem,
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

  const updateData = (keyToUpdate) => {
    // Create a new entry to update
    const updatedDateItem = {
      id: keyToUpdate, // Specify the key of the entry to update
      title: title,
      items: items,
      date: date,
      time: time,
    };

    // Get a reference to the specific entry in the Firebase database
    const dateListRef = ref(
      database,
      `rooms/${REALTIME_DATABASE_KEY_PAIRKEY}/${REALTIME_DATABASE_KEY_DATE}/${keyToUpdate}`,
    );

    // Update the entry in the database
    set(dateListRef, updatedDateItem);

    // Reset the form fields
    setTitle("");
    setItems([]);
    setNewItem("");
    setDate("");
    setTime("");

    document.getElementById("edit-date-form").close();
  };

  return (
    <div className=" rounded-full bg-background p-[5px] text-xs">
      <button
        className="text-center"
        onClick={() => {
          document.getElementById("edit-date-form").showModal();
        }}
      >
        Edit
      </button>
      <dialog id="edit-date-form" className="modal">
        <div className="modal-box flex flex-col items-center rounded-2xl bg-text">
          <form
            method="dialog"
            className="flex  w-96 w-full flex-col justify-center justify-items-center p-[20px] text-accent"
          >
            <button className="btn btn-circle btn-ghost btn-sm absolute right-5 top-5 ">
              ✕
            </button>
            {title === "" ? (
              <label className="mb-[5px] text-red-600">*Date :</label>
            ) : (
              <label className="mb-[5px]">Date :</label>
            )}
            <input
              className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background  px-2"
              type="text"
              name="title"
              value={title}
              placeholder="What're yall doing?"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            {items.length === 0 ? (
              <label className="mb-[5px] text-red-600">*Things needed :</label>
            ) : (
              <label className="mb-[5px]">Things needed :</label>
            )}
            <div className="input-button">
              <input
                className="mb-[15px] mr-[15px] w-[15em] rounded-md bg-background px-2"
                type="text"
                name="newItem"
                value={newItem}
                placeholder="What do you need to bring?"
                onChange={(e) => {
                  setNewItem(e.target.value);
                }}
              />
              <button
                className="rounded-full bg-background px-[7px] font-black"
                onClick={handleSubmit}
              >
                +
              </button>
            </div>
            <ul>
              {items.map((items) => {
                return (
                  <li
                    key={items.id}
                    className="mb-[15px] flex justify-between  rounded-md bg-background px-2 py-1"
                  >
                    <label className="mr-[15px]">{items.title}</label>
                    <button onClick={() => deleteItem(items.id)}>Delete</button>
                  </li>
                );
              })}
            </ul>
            <div className="date-for-date mt-[15px]">
              <label className="mr-[5px]">Date for date :</label>
              <input
                type="date"
                className="mb-2 w-[10em] rounded-md border-[1px] bg-background px-2"
                id="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className="time mt-[15px]">
              <label className="mr-[5px]">Time :</label>
              <input
                type="time"
                className="mb-2 w-[10em] rounded-md border-[1px] bg-background px-2"
                id="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
              />
            </div>
            <button
              className="submit-btn my-[20px] rounded-full bg-background px-[15px] disabled:bg-neutral-500 disabled:text-background"
              disabled={items.length === 0}
              onClick={updateData}
            >
              Submit
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}

// {
//   getListByName(dateArchive).map((dateItem) => (
//     <div
//       key={dateItem.key}
//       className=" m-[30px] flex w-[350px] flex-row items-start justify-between rounded-xl bg-text p-[10px]"
//     >
//       <div className="wrap flex items-start justify-between">
//         <div className="group-for-days rounded-xl bg-background p-[20px]">
//           {dateArchive === false ? (
//             <>
//               <h1 className="text-center text-xl font-bold">
//                 {calculateDaysLeft(dateItem.val.date)}
//               </h1>
//               <h2 className="font-bold">Days</h2>
//             </>
//           ) : (
//             <>
//               <h1 className="text-center text-xl font-bold">
//                 {calculateDaysLeft(dateItem.val.date) * -1}
//               </h1>
//               <h2 className="text-center font-bold">
//                 Days
//                 <br />
//                 Ago
//               </h2>
//             </>
//           )}
//         </div>
//         <div className="group-for-everythingelse ml-[10px]">
//           <h1 className="italic">
//             {dateItem.val.date}
//             <br />
//             {dateItem.val.time}
//           </h1>
//           <h1 className="font-bold">{dateItem.val.title}</h1>
//           {dateItem.val.items.map((item) => (
//             <div className="justify-left flex" key={item.id}>
//               <h1>-{item.title}</h1>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex-col text-center">
//         <EditDateModal />
//         <button
//           className="ml-top mt-[15px] rounded-full bg-background p-[5px] text-xs"
//           onClick={() =>
//             dateArchive
//               ? deleteArchiveItem(dateItem.key)
//               : deleteDateItem(dateItem.key)
//           }
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   ));
// }
