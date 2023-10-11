import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.js";
import { useState, useEffect } from "react";
import { database, storage } from "../firebase/firebase";
import {
  onChildAdded,
  onChildChanged,
  push,
  ref,
  onValue,
} from "firebase/database";
import { Feed } from "../Components/Feed";
import { Composer } from "../Components/Composer";
import NavBar from "../Details/NavBar.js";

const DUMMY_USERID = "dummyuser"; // to use these as subs
const DUMMY_PAIRID = "dummypair"; // to use these as subs

export default function FeedPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);
  const [posts, setPosts] = useState([]); //assuming user info and isLoggedIn comes from context

  useEffect(() => {
    // whenever app renders
    const postRef = ref(database, `${DUMMY_PAIRID}/feed`); //setup reference
    onChildAdded(postRef, (data) => {
      //setup listener
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <NavBar label="Feed" />
        <main>
          <button
            onClick={() => document.getElementById("composer").showModal()}
          >
            {" "}
            +{" "}
          </button>
          <dialog id="composer" className="modal">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <Composer postContent={null} />
          </dialog>
          {/* <Composer postContent = {null} /> */}
          <Feed posts={posts} setPosts={setPosts} />
        </main>
      </div>
    </>
  );
}
