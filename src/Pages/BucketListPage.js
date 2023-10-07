import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.js";
import BucketForm from "../Components/BucketForm.js";

export default function BucketListPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
          <NavLink to="/" className="text-[2em]">
            ←
          </NavLink>
          <p className="text-[2em]">Bucket List</p>
          {context.isLoggedIn ? (
            <p className="text-xs">Signed In</p>
          ) : (
            <p className="text-xs">Signed Out</p>
          )}
        </header>
        <main>
          <BucketForm />
        </main>
      </div>
    </>
  );
}
