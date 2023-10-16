//-----------React-----------//
import { useState } from "react";

//-----------Components-----------//
import { Feed } from "../Components/Feed/Feed";
import { MultiFileComposer } from "../Components/Feed/MultiFileComposer.js";
import NavBar from "../Details/NavBar.js";
import { FilterButtonHolder } from "../Components/Feed/FilterButtonHolder.js";

//-----------Media-----------//
import memoriesimage from "../Images/LogosIcons/word-icon-memories.png";

export default function FeedPage() {
  const [tagFilter, setTagFilter] = useState(new Set()); // this is the active filters for post; pass setTagFilter to the FilterButtonHolder for button creation
  const [customFilter, setCustomFilter] = useState("");

  const closeComposerModal = () => {
    const modal = document.getElementById("composer");
    modal.close();
  };

  return (
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
          tagFilter={
            customFilter ? new Set([customFilter, ...tagFilter]) : tagFilter
          }
        />
      </main>
    </div>
  );
}
