import { NavLink } from "react-router-dom";

import profile from "../Images/upload.png";
import morty from "../Images/morty.png";
import background from "../Images/test.png";

export default function HomePage() {
  //Add Global State for isloggedIn
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <header className="fixed top-0 flex w-screen flex-row justify-between p-3">
          <div className="text-transparent">blankspc</div>
          <img
            src={profile}
            alt="import profile"
            className="h-[4em] rounded-full bg-slate-300 p-2"
          />
          <NavLink to="/settings">
            <img
              src={morty}
              alt="import profile"
              className="h-[4em] rounded-full border-2 border-white bg-slate-300"
            />
          </NavLink>
        </header>
        <main
          style={{ backgroundImage: `url(${background})` }}
          className="flex h-full w-screen flex-col items-center justify-between bg-cover bg-center bg-no-repeat"
        >
          <NavLink
            to="/dates"
            className="j mt-[90px] flex w-3/4 min-w-[20em] max-w-[40em] flex-row items-center rounded-xl bg-slate-300 bg-opacity-80 p-2 shadow-xl"
          >
            <p className="p-3 font-bold"> Next Date:</p>
            <section>
              <p className="font-bold"> 19 October 2023 (Thursday)</p>
              <p> 10.00 am</p>
              <p> Project Presentations</p>
            </section>
          </NavLink>
          <article className=" w-1/2 min-w-[16em] max-w-[28em] rounded-xl bg-white bg-opacity-80 p-2 text-center shadow-xl">
            <p className="text-[1.2em]">Together for</p>
            <h1 className="text-[3em] font-bold">420 days</h1>
            <h1 className="text-[1.2em]">Rick & Morty</h1>
          </article>
          <nav className="m-4 grid w-full max-w-[60em] grid-cols-3 gap-4  p-3 md:grid-cols-6">
            <NavLink
              to="/chat"
              className="btn h-[7em] bg-white hover:bg-slate-200"
            >
              Chat
            </NavLink>
            <NavLink
              to="/feed"
              className="btn h-[7em] bg-white hover:bg-slate-200"
            >
              Feed
            </NavLink>
            <NavLink
              to="/dates"
              className="btn h-[7em] bg-white hover:bg-slate-200"
            >
              Dates
            </NavLink>
            <NavLink
              to="/bucket-list"
              className="btn h-[7em] bg-white hover:bg-slate-200"
            >
              Bucket List
            </NavLink>
            <button className="btn h-[7em] bg-white hover:bg-slate-200">
              Spare
            </button>
            <button className="btn h-[7em] bg-white hover:bg-slate-200">
              Spare
            </button>
          </nav>
        </main>
      </div>
    </>
  );
}
