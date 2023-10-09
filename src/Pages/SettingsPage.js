//-----------React-----------//
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

//-----------Firebase-----------//
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

//-----------Images-----------//
import morty from "../Images/morty.png";

export default function SettingsPage() {
  const [pairKey, setPairKey] = useState("");
  const [tempPairKey, setTempPairKey] = useState("Example123"); //temp pair key till able to import from database

  const navigate = useNavigate();

  // Toggle sign out + navigate back to onboarding
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed Out");
        navigate("/onboarding");
      })
      .catch((error) => {
        console.log("Error Signing Out");
      });
  };

  // Wipe pair account -> Delete all couple data + navigate back to onboarding
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
        <NavLink to="/" className="text-[2em]">
          ←
        </NavLink>
        <p className="text-[2em]">Settings</p>
        <p className="text-transparent">blank</p>
      </header>
      <main className="flex flex-col items-center">
        <img
          src={morty}
          alt="import profile"
          className="h-[8em] w-[8em] rounded-full"
        />
        <form className="w-3/4">
          <label>Display Name:</label>
          <br />
          <input
            type="text"
            className=" input w-full"
            id="displayName"
            placeholder=""
          />
          <br />
          <label>Background Photo:</label>
          <br />

          <input
            type="file"
            className="file-input w-full"
            id="background photo"
            placeholder="Insert file"
          />
          <br />
          <label>Start of relationship:</label>
          <input
            type="date"
            className="input w-full"
            id="background photo"
            placeholder="Insert file"
          />
        </form>
        <button className="btn m-3 w-1/2">Link Google Cal</button>
        <button className="btn w-1/2" onClick={handleSignOut}>
          Sign Out
        </button>
        <button
          className="btn m-3 w-1/2 bg-red-200"
          onClick={() => document.getElementById("delete_modal").showModal()}
        >
          Delete Pair
        </button>
        <dialog id="delete_modal" className="modal ">
          <div className="modal-box bg-slate-100">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-bold">
              Are you sure you want to delete your pair?
            </h3>
            <p className="py-2">
              This operation
              <span className="font-bold text-red-600">
                {" "}
                cannot be reversed
              </span>
              , all images, chats and data for both users will be erased. Enter
              your pair key below to delete your pair.
            </p>
            <p className="py-2">Your Pair Key: {tempPairKey}</p>
            <form>
              <input
                className="input"
                value={pairKey}
                onChange={(e) => setPairKey(e.target.value)}
              ></input>
              <button
                className="btn disabled:text-slate-300"
                disabled={!(pairKey === tempPairKey)}
                onClick={deletePairKey}
              >
                Confirm
              </button>
            </form>
          </div>
        </dialog>
      </main>
    </div>
  );
}
