import React, { useState } from "react";
import { auth, db } from "../firebase";
// import { ref, child, get } from "./firebase/database";
import { ref, onValue } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  // const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  // const [user, setUser] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);

      if (user) {
        setTimeout(() => {
          navigate("/teacher");
        }, 2000);
        setMessage("Redirecting...");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const searchTeacherDB = () => {
    const teacher = ref(db, "/Teacher");
    onValue(teacher, (snapshot) => {
      const teacherValue = snapshot.val();
      console.log(teacherValue);
    });
  };

  console.log(searchTeacherDB());

  const searchStudentDB = () => {
    const student = ref(db, "/Student");
    onValue(student, (snapshot) => {
      const studentValue = snapshot.val();
      console.log(studentValue);
    });
  };

  console.log(searchStudentDB());

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
        <form onSubmit={handleSignin}>
          <p class="text-sm text-left mb-4 font-bold">Login</p>
          <p class="mb-2">{message && message}</p>

          <label for="email" class="block text-sm text-left mb-2">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-2"
          />
          <label for="password" class="block text-sm text-left mb-2">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class=" border text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 mb-6"
          />
          <button class="text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6">
            LOGIN
          </button>
        </form>

        <p class="text-sm">
          Not an existing user?
          <button onClick={() => navigate("signup")}>
            <span class="underline underline-offset-4 m-1">Sign up</span>
          </button>
        </p>
        {/* <p class="text-sm mt-2">
          <button onClick={handleForget}>Forget password?</button>
        </p> */}
      </div>
    </>
  );
};

export default Signup;
