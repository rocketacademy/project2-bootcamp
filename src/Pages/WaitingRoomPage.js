import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import morty from "../Images/morty.png";

// Move waiting room to this -> use basic state management to split create room vs join room -> Build components if needed

export default function PairUp() {
  const [pairKey, setPairKey] = useState("");
  const [keyCreated, setKeyCreated] = useState(false); //temp pair key till able to import from database

  const navigate = useNavigate();

  const deletePairKey = () => {
    console.log("Account deleted");
    //delete user files
    //sign out user
    //set global state back to isSignedIn (false) + isPaired (false)
    navigate("/onboarding");
  };

  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
        <NavLink to="/sign-up" className="text-[2em]">
          ←
        </NavLink>
        <p className="text-[2em]"></p>
        <p className="text-transparent">blank</p>
      </header>
      {keyCreated ? (
        <main className="flex w-screen flex-col items-center">
          <h1 className="text-xl font-bold">Waiting room</h1>
          <p className="mx-5">
            Once your partner has entered your pair key you'll be able to launch
            the app!
          </p>
          <NavLink to="/sign-in" className="btn m-2">
            Launch
          </NavLink>
        </main>
      ) : (
        <main className="flex flex-col items-center">
          <div className="flex flex-row">
            <img
              src={morty}
              alt="Profile"
              className="m-1 h-[8em] rounded-full border-2 border-black p-1"
            />
            <img
              src={morty}
              alt="Profile"
              className="m-1 h-[8em] rounded-full border-2 border-black p-1"
            />
          </div>
          <p className="mx-5 my-2 bg-slate-200">
            Create a unique pair key for you and your partner, once your
            partnered has entered the pair key - you'll be put together!
          </p>

          <form className="w-3/4">
            <label>Create Pair Key:</label>
            <br />
            <input
              type="text"
              className=" mb-2 w-full rounded-md border-[1px] border-black"
              id="displayName"
              placeholder=""
            />

            <br />
            <label>Start of relationship:</label>
            <input
              type="date"
              className="mb-2 w-full rounded-md border-[1px] border-black"
              id="background photo"
              placeholder="Insert file"
            />
          </form>
          <button className="btn w-1/2" onClick={setKeyCreated}>
            Create Room
          </button>
        </main>
      )}
    </div>
  );
}
