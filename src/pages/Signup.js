import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("Teacher");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!password || !email || !username) return;

    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(newUser);
      if (newUser) {
        updateProfile(auth.currentUser, {
          uid: newUser.user.uid,
          displayName: username,
          email: email,
          role: selectedRadio,
        });
        console.log(newUser);
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

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
        <form onSubmit={handleSignUp}>
          <p class="text-sm text-left mb-4 font-bold">Sign Up</p>
          <p class="mb-2">{errorMessage && errorMessage}</p>
          <label for="username" class="block text-sm text-left mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            class=" order text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-2"
          />
          <label for="email" class="block text-sm text-left mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-2"
          />
          <label for="password" class="block text-sm text-left mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-6"
          />
          <div class="flex mb-6">
            <div class="flex items-center me-4">
              <input
                id="teacher-radio"
                type="radio"
                value="Teacher"
                checked={selectedRadio === "Teacher"}
                onChange={(e) => setSelectedRadio(e.target.value)}
                name="role-radio-group"
                class="w-4 h-4 text-blue-600 bg-gray-100"
              />
              <label for="teacher" class="ms-2 text-sm font-medium ">
                Teacher
              </label>
            </div>
            <div class="flex items-center me-4">
              <input
                id="student-radio"
                type="radio"
                value="Student"
                checked={selectedRadio === "Student"}
                onChange={(e) => setSelectedRadio(e.target.value)}
                name="role-radio-group"
                class="w-4 h-4 text-blue-600 bg-gray-100"
              />
              <label for="student" class="ms-2 text-sm font-medium ">
                Student
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6"
            >
              SIGN UP
            </button>
          </div>
        </form>

        <p class="text-sm">
          Already a user?
          <button onClick={() => navigate("/")}>
            <span class="underline underline-offset-4 m-1">Sign in</span>
          </button>
        </p>
      </div>
    </>
  );
};

export default Signup;
