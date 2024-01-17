import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  ref,
  onValue,
  query,
  orderByKey,
  equalTo,
  get,
} from "firebase/database";
import { AlertError } from "../components/Alerts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TextboxWithLabels } from "../components/Textbox";

export const UserContext = React.createContext();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);

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
          const userName = userCredential.user.displayName;
          const uid = userCredential.user.uid;
          console.log("Username: " + userName);
          checkStudentDBV2(uid);
          checkTeacherDBV2(uid);
          if ((checkStudentDBV2(uid) === checkTeacherDBV2(uid)) === null) {
            console.log("User does not exist");
          }
        }
      );
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
  };

  // const checkStudentDB = (userID, emailID) => {
  //   return onValue(
  //     query(ref(db, "Student"), orderByKey("email"), equalTo(emailID)),
  //     (snapshot) => {
  //       const role = snapshot.val() && snapshot.val().role;
  //       console.log(role);
  //       setResponse(role);
  //     },
  //     {
  //       onlyOnce: true,
  //     }
  //   );
  // };

  const checkStudentDBV2 = (uid) => {
    const dbRef = ref(db, `Student/${uid}`);
    get(dbRef).then((snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        return;
      }
      data.role === "Student" && setResponse("Student");
    });
  };

  const checkTeacherDBV2 = (uid) => {
    const dbRef = ref(db, `Teacher/${uid}`);
    get(dbRef).then((snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        return;
      }
      data.role === "Teacher" && setResponse("Teacher");
    });
  };

  // const checkTeacherDB = (userID) => {
  //   return onValue(
  //     ref(db, "/Teacher/" + userID),
  //     (snapshot) => {
  //       const role = snapshot.val() && snapshot.val().role;
  //       console.log(role);
  //       setResponse(role);
  //     },
  //     {
  //       onlyOnce: true,
  //     }
  //   );
  // };

  console.log("Response: " + response);
  return (
    <>
      <UserContext.Provider value={value}>
        <div className="prose max-w-sm">
          <h2 className="text-center">LEARNING MANAGEMENT PLATFORM</h2>
          <div className="pr-12 pl-6 py-6 mt-8  bg-amber-50 rounded-lg">
            <form onSubmit={handleSignin}>
              {showErrorAlert && (
                <AlertError alertText={`Login failed. ${message}`} />
              )}
              <TextboxWithLabels
                label={"Email"}
                type={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={"required"}
              />

              <TextboxWithLabels
                label={"Password"}
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={"required"}
              />

              <button
                type="submit"
                className="btn mt-8 text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6"
              >
                LOGIN
              </button>
            </form>

            <p className="text-sm">
              Not an existing user?
              <button onClick={() => navigate("signup")}>
                <span className="underline underline-offset-4 m-1">
                  Sign up
                </span>
              </button>
            </p>
            <p className="text-sm mt-2">
              <button onClick={() => navigate("password-reset")}>
                Forget password?
              </button>
            </p>
          </div>
        </div>
      </UserContext.Provider>
    </>
  );
};

export default Login;
