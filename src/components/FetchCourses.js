import axios from "axios";
import { ref, onChildAdded, off } from "firebase/database";
import { db } from "../firebase";
import { useState, useEffect } from "react";

export const fetchAttemptedCourses = async (
  spreadsheetId,
  courseGidMap,
  userEmail
) => {
  const attemptedCoursesResults = [];

  for (const [courseTitle, courseGid] of courseGidMap.entries()) {
    const publicSheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${courseGid}`;
    const response = await axios.get(publicSheetUrl);
    const csvData = response.data;
    const rows = csvData.split("\n");
    const parsedData = rows.map((row) => row.split(","));
    const userAttemptedCourse = parsedData
      .slice(1)
      .some((row) => row[1] === userEmail);

    attemptedCoursesResults.push({
      courseTitle: courseTitle,
      hasAttempted: userAttemptedCourse,
    });
  }

  return attemptedCoursesResults;
};

export const useCourseData = () => {
  const DB_COURSE_KEY = "courses";
  const DB_STORAGE_KEY = "courseMaterials";
  const coursesRef = ref(db, DB_COURSE_KEY);
  const courseMaterialsRef = ref(db, DB_STORAGE_KEY);
  const [courseMap, setCourseMap] = useState(new Map());
  const [courseMaterialsMap, setCourseMaterialsMap] = useState(new Map());

  useEffect(() => {
    const handleCourses = (data) => {
      const {
        courseDescription,
        courseID,
        courseTitle,
        createdDate,
        dueDate,
        quizLink,
      } = data.val();
      courseMap.set(courseID, {
        courseDescription,
        courseTitle,
        courseID,
        createdDate,
        dueDate,
        quizLink,
      });
      setCourseMap(
        (prevMap) =>
          new Map(
            prevMap.set(courseID, {
              courseDescription,
              courseTitle,
              courseID,
              createdDate,
              dueDate,
              quizLink,
            })
          )
      );
    };

    const handleCourseMaterials = (data) => {
      const { courseID, fileName, url } = data.val();
      courseMaterialsMap.set(data.key, {
        fileName,
        url,
      });
      setCourseMaterialsMap(
        (prevMap) =>
          new Map(
            prevMap.set(data.key, {
              courseID,
              fileName,
              url,
            })
          )
      );
    };

    onChildAdded(coursesRef, handleCourses);
    onChildAdded(courseMaterialsRef, handleCourseMaterials);

    return () => {
      off(coursesRef, handleCourses);
      off(courseMaterialsRef, handleCourseMaterials);
    };
  }, []);

  return { courseMap, courseMaterialsMap };
};
