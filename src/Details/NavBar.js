import { NavLink } from "react-router-dom";
import StateHelper from "../Components/Helpers/StateHelper";

// Navbar takes in nav, label and src -> please use either label or src to input the header image
const NavBar = ({ nav, label, src }) => {
  return (
    <header className="fixed top-0 flex w-screen flex-row items-center justify-between bg-background p-3 shadow-lg z-10">
      {nav ? (
        <NavLink to={nav} className="text-[2em]">
          ←
        </NavLink>
      ) : (
        <NavLink to="/" className="text-[2em]">
          ←
        </NavLink>
      )}

      {label && <p className="text-[1.6em]">{label}</p>}
      {src && <img src={src} alt="Header" className="h-[5em]" />}
      <StateHelper />
    </header>
  );
};

export default NavBar;
