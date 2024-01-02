import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const generateRandomNumber = () => {
  const randomNumbers = 9;
  return Math.floor(Math.random() * randomNumbers);
};

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("Teacher");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    if (!username || !password || !email) return;
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        updateProfile(auth.currentUser, {
          uid: user.user.uid,
          displayName: username,
          email: email,
          role: selectedRadio,
          ID: user.user.uid + generateRandomNumber(),
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSignup}>
        <p class="text-sm text-left mb-4 font-bold">Sign Up</p>
        <label for="text" class="block text-sm text-left mb-2">
          Username
        </label>
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-2"
        />
        <label for="email" class="block text-sm text-left mb-2">
          Email
        </label>
        <input
          type="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-2"
        />
        <label for="email" class="block text-sm text-left mb-2">
          Password
        </label>
        <input
          type="password"
          autoComplete="password"
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
    </>
  );
};

export default Signup;
