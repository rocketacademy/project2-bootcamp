//-----------React-----------//
import { NavLink } from "react-router-dom";
//-----------Components-----------//
import Button from "../Details/Button";
//-----------Styling-----------//
import { motion } from "framer-motion-3d";
import logo from "../Images/LogosIcons/logo.png";
import Footer from "../Details/Footer";

export default function Onboarding() {
  return (
    <motion.div
      className=" flex h-screen flex-col items-center justify-center bg-background "
      initial={{ opacity: 0, scale: 0 }} // Initial state (hidden and scaled down)
      animate={{ opacity: 1, scale: 1 }} // Final state (visible and at full scale)
      transition={{
        duration: 1, // Animation duration in seconds
        ease: "easeInOut", // Easing function
      }}
    >
      <motion.img
        src={logo}
        alt="logo"
        className="h-[15em] hover:translate-y-[-2px] sm:h-[20em]"
      />
      <ul className="mb-3 scale-90 rounded-md border-[1px] border-black p-2 shadow-lg hover:translate-y-[-2px] sm:scale-100">
        <li>📝 Plan Dates Together</li>
        <li>📅 Remember the important dates</li>
        <li>📹 Record your memories together</li>
        <li>🏆 Celebrate the milestones</li>
        <li>💬 Private chats with juicy prompts</li>
        <li>🪣 List down your shared bucket list</li>
      </ul>
      <NavLink to="/sign-up">
        <Button label="New User" />
      </NavLink>
      <NavLink to="/sign-in">
        <Button label="Existing user" />
      </NavLink>
      <NavLink
        to="/"
        className="m-2 text-sm text-slate-500 hover:translate-y-[-2px] hover:text-slate-800"
      >
        Try our App!
      </NavLink>
      <Footer />
    </motion.div>
  );
}
