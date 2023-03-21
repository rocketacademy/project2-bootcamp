import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import { UserAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();
  const { user, logout } = UserAuth();


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
    

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <IoMdArrowBack onClick/>
            </Link>
          </li>
          {sideBarItems}
        </ul>
      </nav>
      </IconContext.Provider>
    </>
  );
}
