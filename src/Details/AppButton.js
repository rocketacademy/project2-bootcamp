import { NavLink } from "react-router-dom";

const AppButton = ({ src, nav }) => {
  return (
    <div className="flex justify-center">
      <NavLink to={nav}>
        <img
          src={src}
          alt="home apps"
          className="border-1 h-[6em] rounded-full bg-background shadow-lg hover:translate-y-[-3px] hover:shadow-background active:translate-y-[2px] sm:h-[7em]"
        />
      </NavLink>
    </div>
  );
};

export default AppButton;
