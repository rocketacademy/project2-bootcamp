import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.js";
import { useState, useEffect } from "react";
import { database } from "../firebase/firebase";
import {
  onChildAdded,
  onChildChanged,
  push,
  ref,
  onValue,
} from "firebase/database";
import { Feed } from "../Components/Feed/Feed";
import { MultiFileComposer } from "../Components/Feed/MultiFileComposer.js";
import NavBar from "../Details/NavBar.js";
import memoriesimage from "../Images/LogosIcons/word-icon-memories.png";
import { FilterButtonHolder } from "../Components/Feed/FilterButtonHolder.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

export default function FeedPage() {
  const DUMMY_USERID = "dummyuser"; // to use these as subs
  const DUMMY_PAIRID = ContextHelper("pairKey"); // to use these as subs
  //Pull in context from App.js
  const context = useContext(UserContext);
  const [posts, setPosts] = useState([]); //assuming user info and isLoggedIn comes from context
  const [tagFilter, setTagFilter] = useState(new Set()); // this is the active filters for post; pass setTagFilter to the FilterButtonHolder for button creation
  const [customFilter, setCustomFilter] = useState("");

  useEffect(() => {
    // whenever app renders
    const postRef = ref(database, `rooms/${DUMMY_PAIRID}/feed`); //setup reference
    onValue(postRef, (data) => {
      let dataArray = [];
      if (data.val()) {
        dataArray = Object.keys(data.val()).map((key) => {
          return { key: key, val: data.val()[key] };
        });
      }
      setPosts(dataArray);
    });
  }, [DUMMY_PAIRID]);

  // const availableFilters = posts.reduce((acc, post) => {
  //   const tagsAsSet = new Set(post.val.tags.split(' '))
  //   return new Set([...acc, ...tagsAsSet])
  // }, new Set())

  const closeComposerModal = () => {
    const modal = document.getElementById("composer");
    modal.close();
  };

  return (
    <>
      <div className=" flex min-h-screen w-screen flex-col items-center justify-center bg-background">
        <NavBar src={memoriesimage} />
        <nav className="fixed top-[6em] z-10 flex h-10 w-screen items-center justify-between bg-window ">
          <button
            onClick={() => document.getElementById("composer").showModal()}
            className="mx-1 max-h-6 w-1/5 bg-blue-300 text-left"
          >
            Create +
          </button>
          <dialog id="composer" className="modal">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            {/* <Composer className = 'w-1/2 h-1/2 bg-blue-300 flex flex-col' postContent={null} closeComposerModal = {closeComposerModal}/> */}
            <MultiFileComposer
              className="flex h-1/2 w-1/2 flex-col bg-blue-300"
              postContent={null}
              closeComposerModal={closeComposerModal}
            />
          </dialog>
          <FilterButtonHolder
            tagFilter={tagFilter}
            //availableFilters={availableFilters}
            setTagFilter={setTagFilter}
            setCustomFilter={setCustomFilter}
          />
        </nav>
        <main className="mt-[130px] flex flex-col items-center justify-start bg-blue-300">
          <Feed
            posts={posts}
            setPosts={setPosts}
            tagFilter={
              customFilter ? new Set([customFilter, ...tagFilter]) : tagFilter
            }
          />
        </main>
      </div>
    </>
  );
}
