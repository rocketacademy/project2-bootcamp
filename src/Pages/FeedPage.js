//-----------React-----------//
import { useState } from "react";

//-----------Components-----------//
import { Feed } from "../Components/Feed/Feed";
import { MultiFileComposer } from "../Components/Feed/MultiFileComposer.js";
import NavBar from "../Details/NavBar.js";
import { FilterButtonHolder } from "../Components/Feed/FilterButtonHolder.js";

//-----------Media-----------//
import memoriesimage from "../Images/LogosIcons/word-icon-memories.png";
import CreateButton from "../Components/Feed/CreateButton";
import SignInReminder from "../Components/Helpers/SignInReminder";
import ContextHelper from "../Components/Helpers/ContextHelper";

export default function FeedPage() {
  const [tagFilter, setTagFilter] = useState(new Set()); // this is the active filters for post; pass setTagFilter to the FilterButtonHolder for button creation
  const [customFilter, setCustomFilter] = useState("");

  const isLoggedIn = ContextHelper("isLoggedIn");

  return (
    <div className=" flex min-h-screen w-screen flex-col items-center justify-center bg-background">
      <NavBar src={memoriesimage} />
      {isLoggedIn && (
        <nav className="fixed bottom-5 z-10 flex h-12 scale-90 flex-row items-center justify-center rounded-lg bg-white shadow-lg sm:translate-x-0 sm:scale-100">
          <CreateButton
            handleClick={() => document.getElementById("composer").showModal()}
          />
          <dialog id="composer" className="modal">
            <div className="modal-box bg-background">
              <form method="dialog">
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <MultiFileComposer postContent={null} />
            </div>
          </dialog>
          <FilterButtonHolder
            tagFilter={tagFilter}
            //availableFilters={availableFilters}
            setTagFilter={setTagFilter}
            setCustomFilter={setCustomFilter}
          />
        </nav>
      )}
      <main className="mt-[130px] flex flex-col items-center justify-start pb-14">
        <Feed
          tagFilter={
            customFilter ? new Set([customFilter, ...tagFilter]) : tagFilter
          }
        />
      </main>
      {!isLoggedIn && <SignInReminder />}
    </div>
  );
}
