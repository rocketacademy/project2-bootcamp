//-----------React-----------//
import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App.js";
//-----------Components-----------//
import AppButton from "../Details/AppButton.js";
//-----------Firebase-----------//
import { auth } from "../firebase/firebase";
//-----------Images-----------//
import profile from "../Images/upload.png";
import morty from "../Images/morty.png";
import logo from "../Images/LogosIcons/logo.png";
import person1 from "../Images/LogosIcons/person1.png";
import background from "../Images/test.png";
import bucketlist from "../Images/LogosIcons/word-icon-bucketlist.png";
import chat from "../Images/LogosIcons/word-icon-chat.png";
import memories from "../Images/LogosIcons/word-icon-memories.png";
import dates from "../Images/LogosIcons/word-icon-dates.png";
import timeCapsule from "../Images/LogosIcons/word-icon-timecapsule.png";
import journal from "../Images/LogosIcons/word-icon-journal.png";
import CoupleDetails from "../Components/Home/CoupleDetails.js";

export default function HomePage() {
  //Pull in context from App.js
  const context = useContext(UserContext);
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

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <header className="fixed top-0 flex w-screen flex-row justify-between p-3">
          <div className="bg-white text-[10px]">
            <p className="font-bold">State helper:</p>
            <p>Pair Key: {context.pairKey}</p>
            {context.isLoggedIn ? <p>Signed In</p> : <p>Signed Out</p>}
            {context.isPairedUp ? <p>Paired Up</p> : <p>Not Paired</p>}
            {context.isDemo ? <p>Demo</p> : <p>Not Demo</p>}
          </div>

          <img
            src={logo}
            alt="import profile"
            className="h-[4em] rounded-xl bg-background object-scale-down p-1 shadow-lg"
          />
          <NavLink to="/settings">
            <img
              src={profilePicture ? profilePicture : person1}
              alt="import profile"
              className="h-[4em] w-[4em] rounded-full border-2 border-white bg-background object-contain shadow-md hover:translate-y-[-2px] hover:shadow-background"
            />
          </NavLink>
        </header>
        <main
          style={{ backgroundImage: `url(${background})` }}
          className=" flex h-full w-screen flex-col items-center justify-between bg-background bg-cover bg-center bg-no-repeat"
        >
          <NavLink
            to="/dates"
            className="j mt-[90px] flex w-3/4 min-w-[20em] max-w-[40em] flex-row items-center rounded-xl bg-slate-300 bg-opacity-80 p-2 shadow-xl hover:bg-opacity-95"
          >
            <p className="p-3 font-bold"> Next Date:</p>
            <section>
              <p className="font-bold"> 19 October 2023 (Thursday)</p>
              <p> 10.00 am</p>
              <p> Project Presentations</p>
            </section>
          </NavLink>
          <CoupleDetails />
          {/* <article className=" flex w-1/2 min-w-[16em] max-w-[28em] flex-col items-center rounded-xl bg-white bg-opacity-80 p-2 shadow-xl hover:animate-pulse">
            <img src={heart} alt="heartbeat" className=" h-[4em] w-[4em]"></img>
            <p className="text-[1em] leading-none">Together for</p>
            <h1 className="text-[3em] font-bold leading-none">420 days</h1>
            <h1 className="text-[1em]">Rick & Morty</h1>
          </article> */}
          <nav className="mb-4 grid w-full max-w-[60em] grid-cols-3 gap-3 p-3 md:grid-cols-6">
            <AppButton src={chat} nav="/chat" />
            <AppButton src={memories} nav="/memories" />
            <AppButton src={dates} nav="/dates" />
            <AppButton src={bucketlist} nav="/bucket-list" />
            <AppButton src={timeCapsule} />
            <AppButton src={journal} />
          </nav>
        </main>
      </div>
    </>
  );
}
