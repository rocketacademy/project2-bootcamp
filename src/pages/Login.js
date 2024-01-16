import React, { useState } from "react";
import { auth, db } from "../firebase";
import { ref, onValue, query, orderByKey, equalTo } from "firebase/database";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const UserContext = React.createContext();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  // const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const value = {
    user,
  };

  // rewrite DBs
  const handleSignin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          console.log(userCredential);
          const userEmail = userCredential.user.email;
          const userName = userCredential.user.displayName;
          console.log(userName);
          checkStudentDB(userName, userEmail);
          checkTeacherDB(userName);
        }
      );
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  };
  console.log(response);

  const checkStudentDB = (userID, emailID) => {
    return onValue(
      query(ref(db, "Student"), orderByKey("email"), equalTo(emailID)),
      (snapshot) => {
        const role = snapshot.val() && snapshot.val().role;
        console.log(role);
        setResponse(role);
      },
      {
        onlyOnce: true,
      }
    );
  };

  const checkTeacherDB = (userID) => {
    return onValue(
      ref(db, "/Teacher/" + userID),
      (snapshot) => {
        const role = snapshot.val() && snapshot.val().role;
        console.log(role);
        setResponse(role);
      },
      {
        onlyOnce: true,
      }
    );
  };

  // useEffect(() => {
  //   if (!response) return;
  //   if (response === "Teacher") {
  //     setTimeout(() => {
  //       navigate("/teacher");
  //     }, 2000);
  //   } else {
  //     setTimeout(() => {
  //       navigate("/student");
  //     }, 2000);
  //   }
  //   setMessage("Redirecting...");
  //   setUser(auth.currentUser.displayName);
  // }, [response]);

  console.log(user);
  console.log(response);
  return (
    <>
      <UserContext.Provider value={value}>
        <p className="font-bold tracking-wider">
          LEARNING
          <br />
          MANAGEMENT
          <br />
          PLATFORM
        </p>
        <div className="pr-12 pl-6 py-6 mt-8  bg-amber-50 rounded-lg">
          <form onSubmit={handleSignin}>
            <p className="text-sm text-left mb-4 font-bold">Login</p>
            <p className="mb-2">{message && message}</p>

            <label for="email" className="block text-sm text-left mb-2">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full max-w-xs dark:bg-white mb-2 dark:border-gray-600"
            />
            <label for="password" className="block text-sm text-left mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full max-w-xs dark:bg-white mb-6 dark:border-gray-600"
            />
            <button className="text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6">
              LOGIN
            </button>
          </form>

          <p className="text-sm">
            Not an existing user?
            <button onClick={() => navigate("signup")}>
              <span className="underline underline-offset-4 m-1">Sign up</span>
            </button>
          </p>
          <p className="text-sm mt-2">
            <button onClick={() => navigate("password-reset")}>
              Forget password?
            </button>
          </p>
        </div>
      </UserContext.Provider>
    </>
  );
};

export default Login;
