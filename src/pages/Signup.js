import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
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

    if (password.length < 6) {
      setErrorMessage(`Password has to be at least 6 characters.`);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: username,
        });
        set(ref(db, `${selectedRadio}/${user.uid}`), {
          uid: user.uid,
          username: username,
          email: email,
          role: selectedRadio,
        });
        setUsername("");
        setEmail("");
        setPassword("");
        setSelectedRadio("Teacher");
        navigate("/");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage(`Email already in use`);
        }
      });
  };

  return (
    <>
      <p className="font-bold tracking-wider">
        LEARNING
        <br />
        MANAGEMENT
        <br />
        PLATFORM
      </p>
      <div className="px-12 py-6 mt-8 bg-amber-50 rounded-lg">
        <form onSubmit={handleSignUp}>
          <p className="text-sm text-left mb-9 font-bold">Sign Up</p>
          <p className="text-sm mb-6 text-red-600 font-bold">{errorMessage}</p>
          <label for="username" className="block text-sm text-left mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full max-w-xs dark:bg-white mb-2 dark:border-gray-600"
          />

          <label className="block text-sm text-left mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full max-w-xs dark:bg-white mb-2 dark:border-gray-600"
          />
          <label for="password" className="block text-sm text-left mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full max-w-xs dark:bg-white mb-6 dark:border-gray-600"
          />
          <div className="flex mb-6 justify-around">
            <div className="flex items-center me-4">
              <input
                id="teacher-radio"
                type="radio"
                value="Teacher"
                checked={selectedRadio === "Teacher"}
                onChange={(e) => setSelectedRadio(e.target.value)}
                name="role-radio-group"
                className="w-4 h-4 text-blue-600 bg-gray-100"
              />
              <label for="teacher" className="ms-2 text-sm font-medium ">
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
                className="w-4 h-4 text-blue-600 bg-gray-100"
              />
              <label for="student" className="ms-2 text-sm font-medium ">
                Student
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6"
            >
              SIGN UP
            </button>
          </div>
        </form>

        <p className="text-sm">
          Already a user?
          <button onClick={() => navigate("/")}>
            <span className="underline underline-offset-4 m-1">Sign in</span>
          </button>
        </p>
      </div>
    </>
  );
};

export default Signup;
