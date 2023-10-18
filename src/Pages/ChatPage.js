import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App.js";
import NavBar from "../Details/NavBar.js";
import { ChatComposer } from "../Components/Chat/ChatComposer";
import { Chat } from "../Components/Chat/Chat";
import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import background from "../Images/wallpaper.png";

const DUMMY_USERID = "dummyuser"; // to use these as subs
const DUMMY_PAIRID = "dummypair"; // to use these as subs

export default function ChatPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);
  const [chat, setChat] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    // whenever app renders
    const postRef = ref(database, `rooms/${DUMMY_PAIRID}/chat`); //setup reference
    onValue(postRef, (data) => {
      let dataArray = [];
      if (data.val()) {
        dataArray = Object.keys(data.val()).map((key) => {
          return { key: key, val: data.val()[key] };
        });
      }
      setChat(dataArray);
    });
    const userRef = ref(database, `rooms/${DUMMY_PAIRID}/backgroundImage`); //setup reference
    onValue(userRef, (data) => {
      setBackgroundImage(data.val().backgroundImageURL);
    });
  }, []);

  return (
    <div className="h-screen">
      <NavBar label="Chat" />
      <main
        className="mt-[70px] h-full w-screen"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Chat chat={chat} />
        <ChatComposer />
      </main>
    </div>
  );
}
