import { NavLink } from "react-router-dom";

const Footer = (props) => {
  return (
    <footer className="btm-nav">
      <NavLink 
        to="/Explore" 
        className="text-2xl">
            <i className="fi fi-rr-marker"></i>
      </NavLink>
      <NavLink 
        to="/Search" 
        className="text-2xl">
            <i className="fi fi-rr-search"></i>
      </NavLink>
      <NavLink 
        to="/Create" 
        className="text-2xl">
            <i className="fi fi-rr-add"></i>
      </NavLink>
      <NavLink 
        to="/Profile" 
        className="text-2xl">
            <i className="fi fi-rr-circle-user"></i>
      </NavLink>
    </footer>
  );
};

export default Footer;
