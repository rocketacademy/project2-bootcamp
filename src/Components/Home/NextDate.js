import { NavLink } from "react-router-dom";

const NextDate = () => {
  return (
    <NavLink
      to="/dates"
      className="j mt-[90px] flex w-3/4 min-w-[20em] max-w-[40em] flex-row items-center rounded-xl bg-slate-300 bg-opacity-80 p-2 shadow-xl hover:bg-opacity-95"
    >
      <p className="p-3 font-bold"> Next Date:</p>
      <section>
        <p className="font-bold"> 19 October 2023 (Thursday)</p>
        <p> 10.00 am</p>
        <p> Project Presentations</p>
      </section>
    </NavLink>
  );
};

export default NextDate;
