import { NavLink } from "react-router-dom";

const Header = () => {
  
  return (
    <header className="navbar bg-base-100 text-2xl flex justify-between p-4 border-b">
      <a href="/Explore" className="font-sans">
        globalgems
      </a>
    </header>
  );
};

export default Header;
