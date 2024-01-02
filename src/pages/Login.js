import React, { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <form>
        <p class="text-sm text-left mb-4 font-bold">Login</p>
        <label for="email" class="block text-sm text-left mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-2"
        />
        <label for="password" class="block text-sm text-left mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-6"
        />
        <button class="text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6">
          LOGIN
        </button>
      </form>
    </>
  );
};

export default Signup;
