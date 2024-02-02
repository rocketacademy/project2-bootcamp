import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const useLoadChartData = () => {
  const [initialGid, setInititalGid] = useState("");
  const [initialCourse, setInitialCourse] = useState("");

  useEffect(() => {
    const fetchInitialData = () => {
      const coursesRef = ref(db, "courses");
      onValue(coursesRef, (snapshot) => {
        const data = snapshot.val();
        const gid = Object.values(data)[0].gid;
        const course = Object.values(data)[0].courseTitle;
        setInititalGid(gid);
        setInitialCourse(course);
      });
    };

    fetchInitialData();
  }, []);

  return { initialGid, initialCourse };
};

export default useLoadChartData;
