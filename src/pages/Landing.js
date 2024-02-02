import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthProvider";
import { useContext } from "react";

export const Landing = () => {
  const { currentUser, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    role === "teacher" && navigate("/teacher");
    role === "student" && navigate("/student");
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there!</h1>
          <p className="py-6">
            Thank you for signing up, click below to begin!
          </p>
          <button className="btn btn-primary" onClick={navigateToDashboard}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
