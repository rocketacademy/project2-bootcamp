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
//-----------Media-----------//
import heart from "../../Images/heart.gif";

const CoupleDetails = () => {
  //Import display photos

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  //Pull user data
  useEffect(() => {
    const user = auth.currentUser;

    if (user !== null) {
      setDisplayName(user.displayName);
      setEmail(user.email);
      setProfilePicture(user.photoURL);
    }
  }, []);

  // useEffect(() => {
  //   const roomRef = ref(database, pair);
  //   const checkPairedQuery = child(roomRef, "isPairedUp");
  //   get(checkPairedQuery).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log("PAIRED UP - redirect to main");
  //       navigate("/");
  //     } else {
  //       console.log("Not paired up yet! Pls wait");
  //     }
  //   });
  // });

  return (
    <article className=" flex w-1/2 min-w-[16em] max-w-[28em] flex-col items-center rounded-xl bg-white bg-opacity-80 p-2 shadow-xl hover:animate-pulse">
      <img src={heart} alt="heartbeat" className=" h-[4em] w-[4em]"></img>
      <h1 className="text-[1em]">
        {displayName ? displayName : "Person1"} & Morty
      </h1>

      <h1 className="text-[3em] font-bold leading-none">420 days</h1>
      <p className="text-[1em]">Together</p>
    </article>
  );
};

export default CoupleDetails;
