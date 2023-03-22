import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import { UserAuth } from "../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();
  const { user, logout } = UserAuth();
  const location = useLocation();


  function handleSignOut(){
    console.log('signed out')
    logout();
    navigate('/login');
  }

  function handleProfileClick(){
    navigate("/profile/" + user.uid)
  }

  let sideBarItems = SidebarData.map((item, index) => {
    if(item.title === "Sign Out"){
      return (
      <li key={index}
       className={item.cName}
       onClick = {handleSignOut}>              
         <Link to={item.path}>
          {item.icon}
          <span>{item.title}</span>
         </Link>
       </li>
      );
    } else if (item.title === "Profile"){
      return (
      <li key={index}
       className={item.cName}
       onClick = {handleProfileClick}>              
         <Link to={item.path}>
          {item.icon}
          <span>{item.title}</span>
         </Link>
       </li>
      );
    } else{
      return (
      <li key={index}
       className={item.cName}>              
         <Link to={item.path}>
          {item.icon}
          <span>{item.title}</span>
         </Link>
       </li>
      );
    }
  })

  let navBarItems = SidebarData.map((item, index) => {
    if(item.title === "Sign Out"){
      return (
      <li key={index}
       className="navBar-text"
       onClick = {handleSignOut}>              
         <Link to={item.path}>
          <span>{item.title}</span>
         </Link>
       </li>
      );
    } else if (item.title === "Profile"){
      return (
      <li key={index}
       className="navBar-text"
       onClick = {handleProfileClick}>              
         <Link to={item.path}>
          <span>{item.title}</span>
         </Link>
       </li>
      );
    } else{
      return (
      <li key={index}
       className="navBar-text">              
         <Link to={item.path}>
          <span>{item.title}</span>
         </Link>
       </li>
      );
    }
  })
    
  console.log(sidebar)
  return (
    <>
      {location.pathname === "/login"
      ? null
      : <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          {navBarItems}
        </div>
        <Link to="#" className="menu-bars">
          <FaIcons.FaBars className="hamburger-menu" onClick={showSidebar} />
        </Link>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <IoMdArrowBack onClick={showSidebar}/>
            </Link>
          </li>
          {sideBarItems}
        </ul>
      </nav>
      </IconContext.Provider>}
    </>
  );
}
