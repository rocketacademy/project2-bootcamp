import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App.js";
import NavBar from "../Details/NavBar.js";
import { ChatComposer } from "../Components/Chat/ChatComposer";
import { Chat } from "../Components/Chat/Chat";
import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import background from "../Images/wallpaper.png";
import ContextHelper from "../Components/Helpers/ContextHelper.js";



export default function ChatPage() {
  //Pull in context from App.js asd
  const pairKey = ContextHelper("pairKey");
  const [chat, setChat] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    // whenever app renders asd
    if (pairKey) {
    const userRef = ref(database, `rooms/${pairKey}/backgroundImage`); //setup reference
    onValue(userRef, (result) => {
      const val = result.val()
      if (val) {
      setBackgroundImage(val.backgroundImageURL);
      }
    });

    const postRef = ref(database, `rooms/${pairKey}/chat`); //setup reference
    onValue(postRef, (data) => {
      let dataArray = [];
      if (data.val()) {
        dataArray = Object.keys(data.val()).map((key) => {
          return { key: key, val: data.val()[key] };
        });
      }
      setChat(dataArray);
    });
  }
  }, [pairKey]);

  return (
    <div className="h-screen">
      <NavBar label="Chat" />
      <main
        className="mt-[100px] mb-[50px] h-auto w-screen"
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : null}
      >
        <Chat chat={chat} />
        <ChatComposer />
      </main>
    </div>
  );
}
