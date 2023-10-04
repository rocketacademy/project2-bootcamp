import { NavLink } from "react-router-dom";

export default function DatesPage() {
  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
          <NavLink to="/" className="text-[2em]">
            ←
          </NavLink>
          <p className="text-[2em]">Dates</p>
          <p className="text-transparent">blank</p>
        </header>
        <main>
          <p>Insert Dates</p>
        </main>
      </div>
    </>
  );
}
