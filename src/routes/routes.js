import React from "react";
import { Routes, Route } from "react-router-dom";
import Authform from "../pages/Auth/AuthForm";
import Signup from "../components/Signupform";
import Login from "../components/Loginform";
import Error404 from "../pages/NotFound404";

export default function defineRoutesHere() {
  return (
    <Routes>
      <Route path="/" element={<Authform />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Signup />} />
      </Route>
      <Route path="*" element={<Error404 />}/>
    </Routes>
  );
}
