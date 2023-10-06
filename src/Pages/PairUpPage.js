import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import morty from "../Images/morty.png";
import heart from "../Images/heart.gif";

export default function PairUp() {
  const [pairKey1, setPairKey1] = useState("");
  const [pairKey2, setPairKey2] = useState("");
  const [startDate, setStartDate] = useState("");
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const copyToClipboard = () => {
    navigator.clipboard.writeText("rick&morty");
    setCopied(true);
  };

  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
        <NavLink to="/sign-in" className="text-[2em]">
          ←
        </NavLink>
        <p className="text-[2em]">Pair Up</p>
        <p className="text-transparent">blank</p>
      </header>
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
      {/* Create room */}
      <main className="m-2 flex w-[30em] flex-col items-center rounded-lg border-[1px] border-slate-800  p-2">
        <p className="mx-5 my-2 font-bold">
          Create a unique pair key for you and your partner
        </p>
        <form className="flex flex-col items-center">
          <label>Create Pair Key:</label>
          <input
            type="text"
            className=" mb-2 w-[10em] rounded-md border-[1px] border-black px-2"
            id="create-pairkey"
            value={pairKey1}
            onChange={(e) => {
              setPairKey1(e.target.value);
            }}
            placeholder="rick&morty"
          />
          <label>Start of relationship:</label>
          <input
            type="date"
            className="mb-2 w-[10em] rounded-md border-[1px] border-black px-2"
            id="startDate"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
          />
        </form>
        {/* Waiting room modal */}
        <button
          className="btn w-[10em]"
          onClick={() => document.getElementById("waiting-room").showModal()}
        >
          create room
        </button>
        <dialog id="waiting-room" className="modal">
          <div className="modal-box flex flex-col items-center bg-slate-100">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <img src={heart} alt="heart" className="h-[8em]" />
            {copied ? (
              <p className="text-green-800">Pair key copied!</p>
            ) : (
              <p>Click to copy:</p>
            )}
            <button
              className="rounded-lg bg-slate-200 p-2 text-lg font-bold shadow-md active:translate-y-[3px]"
              onClick={copyToClipboard}
            >
              📑 rick&morty
            </button>
            <p className="py-3 text-center">
              Once your partner has entered your pair key you'll be put together
              in the room.
            </p>
            <NavLink to="/" className="btn m-2">
              Launch
            </NavLink>
          </div>
        </dialog>
      </main>
      {/* Join room */}
      <main className="m-2 flex w-[30em] flex-col items-center rounded-lg border-[1px] border-slate-800  p-2">
        <p className="mx-5 my-2 font-bold">
          Already have a pair key? Enter your key below
        </p>
        <form className="flex flex-col items-center">
          <label>Enter your Pair Key:</label>
          <input
            type="text"
            className=" mb-2 w-[10em] rounded-md border-[1px] border-black"
            id="join-pairkey"
            value={pairKey2}
            onChange={(e) => {
              setPairKey2(e.target.value);
            }}
          />
        </form>
        <NavLink to="/" className="btn w-[10em]">
          Join Room
        </NavLink>
      </main>
    </div>
  );
}
