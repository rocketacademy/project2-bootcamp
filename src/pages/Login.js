import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { AlertError } from "../components/Alerts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TextboxWithLabels } from "../components/Textbox";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      // const userName = data.user.displayName;
      const uid = data.user.uid;

      checkStudentDBV2(uid);
      checkTeacherDBV2(uid);
      const data = await signInWithEmailAndPassword(auth, email, password);
      // const userName = data.user.displayName;
      const uid = data.user.uid;

      checkStudentDBV2(uid);
      checkTeacherDBV2(uid);
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
  };

  useEffect(() => {
    if (!response) {
      console.log("User does not exist");
    } else if (response === "teacher") {
      navigate("teacher");
    } else if (response === "student") {
      navigate("student");
    }
  }, [response]);
  useEffect(() => {
    if (!response) {
      console.log("User does not exist");
    } else if (response === "teacher") {
      navigate("teacher");
    } else if (response === "student") {
      navigate("student");
    }
  }, [response]);

  const checkStudentDBV2 = (uid) => {
    const dbRef = ref(db, `Student/${uid}`);
    get(dbRef).then((snapshot) => {
      const data = snapshot.val();

      if (data === null) {
        return;
      }
      data.role === "Student" && setResponse("student");
      data.role === "Student" && setResponse("student");
    });
  };

  const checkTeacherDBV2 = (uid) => {
    const dbRef = ref(db, `Teacher/${uid}`);
    get(dbRef).then((snapshot) => {
      const data = snapshot.val();

      if (data === null) {
        return;
      }
      data.role === "Teacher" && setResponse("teacher");
      data.role === "Teacher" && setResponse("teacher");
    });
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">LMS</h1>
            <p className="py-6">
              Please register/login with your gmail account. It will be used for
              taking quizzes and tracking of attendance.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSignin}>
              {showErrorAlert && (
                <AlertError alertText={`Login failed. ${message}`} />
              )}
              <div className="form-control">
                <TextboxWithLabels
                  label={"Email"}
                  type={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={"required"}
                />
              </div>
              <div className="form-control">
                <TextboxWithLabels
                  label={"Password"}
                  type={"password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={"required"}
                />
                <label className="label">
                  <a href="signup" className="label-text-alt link link-hover">
                    Not an existing user?
                  </a>
                  <a
                    href="password-reset"
                    className="label-text-alt link link-hover"
                  >
                    Forgot password?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <div className="prose max-w-sm">
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
              <span className="underline underline-offset-4 m-1">Sign up</span>
            </button>
          </p>
          <p className="text-sm mt-2">
            <button onClick={() => navigate("password-reset")}>
              Forget password?
            </button>
          </p>
        </div>
      </div> */}
    </>
  );
};

export default Login;
