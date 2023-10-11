//-----------Todo-----------//
/*
- Pull the names of both the couples (displayName1 & 2)
- Update the number of days the couple has been together
- Import display images?
*/
//-----------React-----------//
import { useState, useEffect } from "react";
//-----------Firebase-----------//
import { auth, database } from "../../firebase/firebase";
import { ref, child, get } from "firebase/database";
//-----------Media-----------//
import heart from "../../Images/heart.gif";
import ContextHelper from "../Helpers/ContextHelper";
import { NavLink } from "react-router-dom";

const CoupleDetails = () => {
  //Import display photos
  const pairKey = ContextHelper("pairKey");
  const [days, setDays] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  //Pull User Data
  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setDisplayName(user.displayName);
      setProfilePicture(user.photoURL);
    }
  }, []);

  //Pull start date from couple's room
  useEffect(() => {
    if (pairKey) {
      console.log("Pairkey", pairKey);
      const roomRef = ref(database, pairKey);
      const dateQuery = child(roomRef, "startDate");
      get(dateQuery).then((snapshot) => {
        if (snapshot.exists()) {
          setDays(daysTogether(snapshot.val()));
        } else {
          console.log("Issue Pulling Start Date");
        }
      });
    }
  });

  //Calculate number of days together
  const daysTogether = (startDate) => {
    const currentDate = new Date();
    const parsedStartDate = new Date(startDate);
    const timeDifference = currentDate - parsedStartDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  return (
    <article className="flex w-1/2 min-w-[16em] max-w-[28em] flex-col items-center rounded-xl bg-white bg-opacity-80 p-2 shadow-lg hover:translate-y-[-2px] hover:shadow-window ">
      <img src={heart} alt="heartbeat" className=" h-[4em] w-[4em]"></img>
      {pairKey ? (
        <>
          <h1 className="text-[1em]">
            {displayName ? displayName : "Person1"} & Morty
          </h1>

          <h1 className="text-center text-[2.6em] font-bold leading-none">
            {days} days
          </h1>
          <p className="text-[1em]">Together</p>
        </>
      ) : (
        <NavLink to="/onboarding" className="animate-bounce text-[1.2em]">
          Click here to Sign In!
        </NavLink>
      )}
    </article>
  );
};

export default CoupleDetails;
