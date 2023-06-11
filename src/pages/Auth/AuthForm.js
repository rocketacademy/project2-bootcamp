import React from "react";
import { Link, Outlet } from "react-router-dom";

const Authform = () => {
  return (
    <div>
      <h1>You are in the Auth page!</h1>
      <h3>URL: localhost:3000/auth</h3>
      <div>
        <p>
          Register an account. Click <Link to="/register">here</Link>.
        </p>
        <p>
          Already have an account ? Click <Link to="/login">here</Link>.
        </p>
      </div>
      <Outlet />
    </div>
  );
}

export default Authform;