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
import {MultiFileComposer} from '../Components/Feed/MultiFileComposer.js'
import NavBar from "../Details/NavBar.js";
import memoriesimage from "../Images/LogosIcons/word-icon-memories.png";
import { FilterButtonHolder } from "../Components/Feed/FilterButtonHolder.js";

const DUMMY_USERID = "dummyuser"; // to use these as subs
const DUMMY_PAIRID = "dummypair"; // to use these as subs

export default function FeedPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);
  const [posts, setPosts] = useState([]); //assuming user info and isLoggedIn comes from context
  const [tagFilter, setTagFilter] = useState(new Set()) // this is the active filters for post; pass setTagFilter to the FilterButtonHolder for button creation
  const [customFilter, setCustomFilter] = useState('')

  useEffect(() => {
    // whenever app renders
    const postRef = ref(database, `rooms/${DUMMY_PAIRID}/feed`); //setup reference
    onValue(postRef, (data) => {
      let dataArray = []
      if (data.val()) {
        dataArray = Object.keys(data.val()).map((key) => {
          return { key: key, val: data.val()[key] }
        })
      } 
      setPosts(dataArray)
    })
  }, []);

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
      <div className=" flex flex-col w-screen items-center justify-center min-h-screen bg-background font-fontspring">
        <NavBar src={memoriesimage} />
        <nav className="fixed top-[6em] flex h-10 w-screen items-center justify-between bg-window z-10 ">
          <button
            onClick={() => document.getElementById("composer").showModal()}
            className = 'text-left mx-1 bg-blue-300 max-h-6 w-1/5'
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
            <MultiFileComposer className = 'w-1/2 h-1/2 bg-blue-300 flex flex-col' postContent={null} closeComposerModal = {closeComposerModal}/>
          </dialog>
          <FilterButtonHolder 
          tagFilter={tagFilter} 
          //availableFilters={availableFilters} 
          setTagFilter = {setTagFilter} 
          setCustomFilter = {setCustomFilter}
          />
        </nav>
        <main className="mt-[130px] bg-blue-300 flex flex-col items-center justify-start">
          <Feed posts={posts} setPosts={setPosts} tagFilter = {customFilter ? new Set([customFilter, ...tagFilter]) : tagFilter}/>
        </main>
      </div>
    </>
  );
}
