import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    currentUser: null,
    role: null,
    photo: null,
    uid: null,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setAuthState({
          currentUser: user,
          role: role,
          photo: user.photoURL,
          uid: user.uid,
        });
      } else {
        setAuthState({
          currentUser: null,
          role: null,
          photo: null,
          uid: null,
        });
      }
    });

    // return () => {
    //   unsubscribe();
    // };
  }, []);

  const updatePhoto = (newPhotoURL) => {
    setAuthState((prevState) => ({
      ...prevState,
      photo: newPhotoURL,
    }));
  };

  const getUserRole = async (uid) => {
    const studentRef = ref(db, `Student/${uid}`);
    const teacherRef = ref(db, `Teacher/${uid}`);

    const studentSnapshot = await get(studentRef);
    const teacherSnapshot = await get(teacherRef);

    if (studentSnapshot.exists()) {
      return "student";
    } else if (teacherSnapshot.exists()) {
      return "teacher";
    } else {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, updatePhoto }}>
      {children}
    </AuthContext.Provider>
  );
};
