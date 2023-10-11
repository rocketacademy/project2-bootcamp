import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.js";
import NavBar from "../Details/NavBar.js";

export default function ChatPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <NavBar label="Chat" />
        <main>
          <p>Insert Chat</p>
          {context.isLoggedIn ? <p>Logged In</p> : <p>Logged Out</p>}
          <button
            className="btn"
            onClick={() => {
              context.setIsLoggedIn(!context.isLoggedIn);
            }}
          >
            Switch
          </button>
        </main>
      </div>
    </>
  );
}
