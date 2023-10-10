//-----------React-----------//
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App.js";
//-----------Components-----------//
import Button from "../Details/Button";

//-----------Firebase-----------//
import { database, auth } from "../firebase/firebase";
import { ref, set, child, get, update } from "firebase/database";

//-----------Images-----------//
import heart from "../Images/heart.gif";
import person1 from "../Images/LogosIcons/person1.png";
import person2 from "../Images/LogosIcons/person2.png";

export default function PairUp() {
  const [pairKeyCreate, setPairKeyCreate] = useState("");
  const [pairKeyJoin, setPairKeyJoin] = useState("");
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("Create Pair Key:");
  const [joinMessage, setJoinMessage] = useState("Enter your Pair Key:");

  //Toggles
  const [copied, setCopied] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isUnique, setIsUnique] = useState(false);
  //Profile data pulled from Auth
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [profilePicture, setProfilePicture] = useState(null);

  const DB_PAIRKEY_KEY = "pairKeyRef";
  const context = useContext(UserContext);
  const navigate = useNavigate();

  // Create - Copy clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairKeyCreate);
    setCopied(true);
  };

  // Create - Check if both inputs are filled and the pair key is unique
  useEffect(() => {
    setIsFilled(
      pairKeyCreate.trim() !== "" && startDate.trim() !== "" && isUnique,
    );
  }, [pairKeyCreate, startDate, isUnique]);

  // Create - Write data to firebase to create a new room + add the pairkey to the database
  const createRoom = () => {
    const pairKeyRef = ref(database, DB_PAIRKEY_KEY);
    const roomRef = ref(database, pairKeyCreate);
    // Create pairKey Room
    update(pairKeyRef, {
      [pairKeyCreate]: pairKeyCreate,
    })
      .then(() => {
        // Upload user data to room
        return set(roomRef, {
          pairKey: pairKeyCreate,
          startDate: startDate,
          displayName1: displayName,
          profilePicture1: profilePicture,
          email1: email,
        });
      })
      .then(() => {
        // Set the pair key to global context
        context.setPairKey(pairKeyCreate);
      })
      .catch((error) => {
        console.error("Error writing data:", error);
      });
  };
  // Create - Check on every keypress that pairKeyCreate if the value is unique
  useEffect(() => {
    if (pairKeyCreate !== "") {
      const dbRef = ref(database, DB_PAIRKEY_KEY);
      const pairKeyQuery = child(dbRef, pairKeyCreate);
      // Display message on uniqueness of pair key
      get(pairKeyQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setMessage("❌ Pair key already exists");
            setIsUnique(false);
          } else {
            setMessage(
              <p>
                ✅ <strong>{pairKeyCreate}</strong> is available
              </p>,
            );
            setIsUnique(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // Reset to default
    setMessage("Create Pair Key:");
  }, [pairKeyCreate]);

  //Create - Check pairkey for isPairedUp to appear
  const checkPaired = () => {
    if (pairKeyCreate !== "") {
      const roomRef = ref(database, pairKeyCreate);
      const checkPairedQuery = child(roomRef, "isPairedUp");
      get(checkPairedQuery).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("PAIRED UP - redirect to main");
          navigate("/");
        } else {
          console.log("Not paired up yet! Pls wait");
        }
      });
    }
  };

  //Join - Check if pairkey is created + No second email in pairkey
  const joinRoom = () => {
    if (pairKeyJoin !== "") {
      const pairKeyRef = ref(database, DB_PAIRKEY_KEY);
      const pairKeyQuery = child(pairKeyRef, pairKeyJoin);

      // Check pairkey is created
      get(pairKeyQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log("Join - Pair Key exists!");
            // Check email2 does not exist within pairkey room
            const roomRef = ref(database, pairKeyJoin);
            const emailQuery = child(roomRef, "email2");

            get(emailQuery).then((emailSnapshot) => {
              if (emailSnapshot.exists()) {
                console.log("Joining failed - Pairkey room already filled");
                setJoinMessage("❌ Join failed - Pair key already matched");
              } else {
                navigate("/");
                console.log("Join - Room is available");
                //Add joining user data to pairkey room
                return update(roomRef, {
                  displayName2: displayName,
                  profilePicture2: profilePicture,
                  email2: email,
                  isPairedUp: true,
                });
              }
            });
          } else {
            setJoinMessage("❌ Join failed - Pair key does not exist");
            console.log("Join - Pair Key does NOT exist");
          }
        })
        .then(() => {
          // Set the pair key to global context
          context.setPairKey(pairKeyJoin);
        })
        .catch((error) => {
          console.error("Error writing data:", error);
        });
    }
  };

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
    <div className=" flex h-screen flex-col items-center justify-center bg-background">
      <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
        <NavLink to="/sign-in" className="text-[2em]">
          ←
        </NavLink>
        <p className="text-[2em]">Pair Up</p>
        <p className="text-transparent">blank</p>
      </header>
      <div className="flex flex-row">
        <img
          src={profilePicture ? profilePicture : person1}
          alt="Profile"
          className="m-1 h-[8em] w-[8em] scale-x-[-1] rounded-full border-2 border-black bg-white object-contain p-1"
        />
        <img
          src={person2}
          alt="Profile"
          className="m-1 h-[8em] w-[8em]  rounded-full border-2 border-black bg-white object-contain p-1"
        />
      </div>
      {/* Create room */}
      <main className="m-2 flex w-[30em] flex-col items-center rounded-lg border-[1px] border-slate-800 p-2">
        <p className="mx-5 my-2 font-bold">
          Create a unique pair key for you and your partner
        </p>
        <form className="flex flex-col items-center">
          <label className=" p-1 text-sm">{message}</label>
          <input
            type="text"
            className=" mb-2 w-[10em] rounded-md border-[1px] border-black px-2"
            id="create-pairkey"
            value={pairKeyCreate}
            onChange={(e) => {
              setPairKeyCreate(e.target.value.toLowerCase());
            }}
            placeholder="rick&morty"
          />
          {/* Unique pair key confirmation message */}

          <label className="pb-1 text-sm">Start of relationship:</label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="mb-2 w-[10em] rounded-md border-[1px] border-black px-2"
            id="startDate"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
          />
        </form>

        {/* Waiting room modal */}
        <Button
          label="Create Room"
          disabled={!isFilled}
          handleClick={() => {
            document.getElementById("waiting-room").showModal();
            createRoom();
          }}
        />
        <Button label="Check Pairing" onClick={checkPaired} />

        <dialog id="waiting-room" className="modal">
          <div className="modal-box flex flex-col items-center bg-white">
            <form method="dialog">
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
              id="copyToClipboard"
              className="rounded-lg bg-window p-2 text-lg font-bold shadow-md hover:translate-y-[-1px] active:translate-y-[3px]"
              onClick={copyToClipboard}
            >
              📑 {pairKeyCreate}
            </button>
            <p className="py-3 text-center">
              Once your partner has entered your pair key you'll be put together
              in the room.
            </p>
            <Button label="Check Pairing" handleClick={checkPaired} />
          </div>
        </dialog>
      </main>
      {/* Join room */}
      <main className="m-2 flex w-[30em] flex-col items-center rounded-lg border-[1px] border-slate-800  p-2">
        <p className="mx-5 my-2 font-bold">
          Already have a pair key? Enter your key below
        </p>
        <form className="flex flex-col items-center">
          <label className="pb-1 text-sm">{joinMessage}</label>
          <input
            type="text"
            className=" mb-2 w-[10em] rounded-md border-[1px] border-black"
            id="join-pairkey"
            value={pairKeyJoin}
            onChange={(e) => {
              setPairKeyJoin(e.target.value);
            }}
          />
        </form>
        <Button label="Join Room" handleClick={joinRoom} />
      </main>
    </div>
  );
}
