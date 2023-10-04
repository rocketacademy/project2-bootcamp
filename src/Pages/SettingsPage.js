import { NavLink } from "react-router-dom";
import morty from "../Images/morty.png";

export default function SettingsPage() {
  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
        <NavLink to="/" className="text-[2em]">
          ←
        </NavLink>
        <p className="text-[2em]">Settings</p>
        <p className="text-transparent">blank</p>
      </header>
      <main className="flex flex-col items-center">
        <img
          src={morty}
          alt="import profile"
          className="h-[8em] w-[8em] rounded-full"
        />
        <form className="w-3/4">
          <label>Display Name:</label>
          <br />
          <input
            type="text"
            className=" mb-2 w-full rounded-md border-[1px] border-black"
            id="displayName"
            placeholder=""
          />
          <br />
          <label>Background Photo:</label>
          <br />

          <input
            type="file"
            className=" mb-2 w-full rounded-md border-[1px] border-black"
            id="background photo"
            placeholder="Insert file"
          />
          <br />
          <label>Start of relationship:</label>
          <input
            type="date"
            className="mb-2 w-full rounded-md border-[1px] border-black"
            id="background photo"
            placeholder="Insert file"
          />
        </form>
        <button className="btn m-3 w-1/2">Link Google Cal</button>
        <NavLink to="/onboarding" className="btn w-1/2">
          Sign Out
        </NavLink>
      </main>
    </div>
  );
}
