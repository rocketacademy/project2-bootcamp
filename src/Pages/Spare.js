// import CreateMemory from "../Components/Feed/CreateMemory.js";
import CreateButton2 from "../Components/Feed/CreateButton2.js";
import NavBar from "../Details/NavBar.js";
import MemoryComposer from "../Components/Feed/MemoryComposer.js";

export default function Spare() {
  //Pull in context from App.js
  const details = {
    message: "Hello",
    time: "time syntax",
    tags: "memory",
  };

  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <NavBar label="Spare" />
      <CreateButton2
        handleClick={() => document.getElementById("composer").showModal()}
      />
      <dialog id="composer" className="modal">
        <div className="modal-box bg-background">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <MemoryComposer postContent={null} />
        </div>
      </dialog>
    </div>
  );
}
