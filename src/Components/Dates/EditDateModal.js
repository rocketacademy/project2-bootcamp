//-----------React-----------//
import React, { useState, useEffect } from "react";

//-----------Firebase-----------//
import { ref, onChildAdded } from "firebase/database";
import { database } from "../../firebase/firebase";

//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";

//Database key for date-list
const REALTIME_DATABASE_KEY_DATE = "date-list";
const REALTIME_DATABASE_KEY_PAIRKEY = ContextHelper("pairKey");

export default function EditDateModal() {
  //create state to view date list on modal
  const [dateList, setDateList] = useState([]);

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
            {dateList.map((dateItem) => (
              <div
                key={dateItem.key}
                className=" m-[30px] flex w-[350px] flex-row items-start justify-between rounded-xl bg-text p-[10px]"
              >
                <div className="wrap flex items-start justify-between">
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
            ))}
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
