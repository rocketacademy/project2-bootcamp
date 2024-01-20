import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const useLoadStudent = () => {
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const fetchAllUsers = () => {
      const usersRef = ref(db, "Student");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const numLength = Object.keys(data).length;
        setStudentCount(numLength);
      });
    };
    fetchAllUsers();
  }, []);

  return { studentCount };
};

export default useLoadStudent;
