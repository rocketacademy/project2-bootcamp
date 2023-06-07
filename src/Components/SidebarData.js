import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoIosPaper } from "react-icons/io";
import { BiLogOut } from "react-icons/bi"


export const SidebarData = [
  {
    title: "Feed",
    path: "/feed",
    icon: <AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Add a Review",
    path: "/create-review",
    icon: <IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Profile",
    path: `/`,
    icon: <FaUserCircle />,
    cName: "nav-text",
  },
  {
    title: "Sign Out",
    path: "/login",
    icon: <BiLogOut />,
    cName: "nav-text",
  },
];
