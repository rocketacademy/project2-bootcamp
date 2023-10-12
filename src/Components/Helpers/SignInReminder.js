import { NavLink } from "react-router-dom";
import heart from "../../Images/heart.gif";

const SignInReminder = () => {
  return (
    <NavLink to="/onboarding" className="fixed">
      <article className=" flex h-[12em] w-1/2 min-w-[16em] max-w-[28em] flex-col items-center justify-center rounded-xl bg-white p-2 shadow-lg hover:translate-y-[-2px] hover:shadow-window ">
        <img src={heart} alt="heartbeat" className=" h-[4em] w-[4em]"></img>
        <button className="animate-bounce text-[1.2em]">
          Click here to Sign In!
        </button>
      </article>
    </NavLink>
  );
};

export default SignInReminder;
