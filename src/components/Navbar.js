import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthProvider";
import { useContext } from "react";

export const Navbar = () => {
  const { currentUser, role, photo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const navbarItems = () => {
    console.log(currentUser);
    console.log(role);
    if (currentUser && role === "student") {
      return (
        <>
          <li className="navbar-item">
            <a href="/student">Dashboard</a>
          </li>

          <li className="navbar-item">
            <a href="/student/courses">Student Courses</a>
          </li>
        </>
      );
    } else if (currentUser && role === "teacher") {
      return (
        <>
          <li className="navbar-item">
            <a href="/teacher">Dashboard</a>
          </li>
          <li className="navbar-item">
            <a href="/teacher/attendance">Attendance</a>
          </li>
          <li className="navbar-item">
            <a href="/teacher/resources/courseform">Create Course</a>
          </li>
          <li className="navbar-item">
            <a href="/teacher/resources">Resources</a>
          </li>
        </>
      );
    }
  };

  return (
    <>
      {currentUser && currentUser.displayName && (
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
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
                {navbarItems()}
              </ul>
            </div>
            <p className="text-l mx-3">
              <b>LMS</b>
            </p>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">{navbarItems()}</ul>
            </div>
          </div>

          <div className="navbar-end">
            <a className="btn btn-ghost" onClick={handleSignOut}>
              Logout
            </a>
            <div className="dropdown dropdown-end">
              {photo ? (
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle border-gray-300 avatar placeholder"
                >
                  <div className="w-10 rounded-full text-neutral-content">
                    <span>
                      <img src={photo} />
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle border-gray-300 avatar placeholder"
                >
                  <div className="w-10 rounded-full bg-error text-neutral-content">
                    <span>
                      {currentUser.displayName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                {role === "teacher" && (
                  <li className="navbar-item">
                    <a href="/teacher/settings">Settings</a>
                  </li>
                )}
                {role === "student" && (
                  <li className="navbar-item">
                    <a href="/student/settings">Settings</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
