import { NavLink } from "react-router-dom";

export default function Onboarding() {
  return (
    <div className=" flex h-screen flex-col items-center justify-center ">
      <h1 className="m-3 text-[2em] font-bold">Paired Up 🧦</h1>
      <ul>
        <li>📝 Plan Dates Together</li>
        <li>📅 Remember the important dates</li>
        <li>📹 Record your memories together</li>
        <li>🏆 Celebrate the milestones</li>
        <li>💬 Private chats with juicy prompts</li>
        <li>🪣 List down your shared bucket list</li>
      </ul>
      <NavLink to="/sign-up" className="btn m-2 w-1/3 max-w-[15rem]">
        New User
      </NavLink>
      <NavLink to="/sign-in" className="btn w-1/3 max-w-[15rem]">
        Existing User
      </NavLink>
      <NavLink
        to="/"
        className="mt-2 text-sm text-slate-500 hover:text-slate-800"
      >
        Try our App!
      </NavLink>
    </div>
  );
}
