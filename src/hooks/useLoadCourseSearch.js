import { useState, useEffect } from "react";
import { ref, onChildAdded } from "firebase/database";
import { db } from "../firebase";

const useLoadCourseSearch = () => {
  const [courseGidMap, setCourseGidMap] = useState(new Map());
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    const fetchCourseData = () => {
      const coursesRef = ref(db, "courses");
      onChildAdded(coursesRef, (data) => {
        const { courseTitle, gid } = data.val();
        courseGidMap.set(courseTitle, gid);
        setCourseGidMap((prevMap) => prevMap.set(courseTitle, gid));
        const courseTitles = Array.from(courseGidMap.keys());
        setCourseOptions(
          courseTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))
        );
      });
    };

    fetchCourseData();
  }, []);

  return { courseOptions, courseGidMap };
};

export default useLoadCourseSearch;
