import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <p class="font-bold tracking-wider">
        LEARNING
        <br />
        MANAGEMENT
        <br />
        PLATFORM
      </p>
      <div class="pr-12 pl-6 py-6 mt-8  bg-amber-50 rounded-lg">
        {isLogin ? <Login /> : <Signup />}

        <p class="text-sm">
          {isLogin ? "Not an existing user?" : "Already a user?"}

          <button onClick={() => setIsLogin(!isLogin)}>
            <span class="underline underline-offset-4 m-1">
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </button>
        </p>
      </div>
    </>
  );
};

export default Auth;
