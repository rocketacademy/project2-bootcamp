import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const Navbar = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const initials = user.displayName.slice(0, 2).toUpperCase();
        setUser(initials);
      }
    });
  });

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/student">Student Home</a>
            </li>
            <li>
              <a href="/teacher">Teacher Home</a>
            </li>
            <li>
              <a href="/teacher/attendance">Attendance</a>
            </li>
            <li>
              <a href="/teacher/resources/courseform">Create Course</a>
            </li>
            <li>
              <a href="/teacher/resources">Resources</a>
            </li>
            <li>
              <a href="/student/courses">Student Courses</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">LMS</a>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="/student">Student Home</a>
            </li>
            <li>
              <a href="/teacher">Teacher Home</a>
            </li>
            <li>
              <a href="/teacher/attendance">Attendance</a>
            </li>
            <li>
              <a href="/teacher/resources/courseform">Create Course</a>
            </li>
            <li>
              <a href="/teacher/resources">Resources</a>
            </li>
            <li>
              <a href="/student/courses">Student Courses</a>
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div> */}
      <div className="navbar-end">
        <a className="btn btn-ghost">Logout</a>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar placeholder"
          >
            <div className="w-20 rounded-full bg-neutral text-neutral-content">
              <span>{user}</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a href="/teacher/settings">Teacher Settings</a>
            </li>
            <li>
              <a href="/student/settings">Student Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
