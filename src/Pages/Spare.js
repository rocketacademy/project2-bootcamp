import CreateMemory from "../Components/Feed/CreateMemory.js";
import NavBar from "../Details/NavBar.js";

export default function Spare() {
  //Pull in context from App.js
  const details = {
    message: "Hello",
    tags: "memory",
  };

  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <NavBar label="Spare" />
      <main>
        <CreateMemory details={details} />
      </main>
    </div>
  );
}
