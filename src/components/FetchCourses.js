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

  for (const [courseID, { courseTitle, gid }] of courseGidMap.entries()) {
    const publicSheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const response = await axios.get(publicSheetUrl);
    const csvData = response.data;
    const rows = csvData.split("\n");
    const parsedData = rows.map((row) => row.split(","));
    const userAttemptedCourse = parsedData
      .slice(1)
      .some((row) => row[1] === userEmail);

    attemptedCoursesResults.push({
      courseID: courseID,
      courseTitle: courseTitle,
      hasAttempted: userAttemptedCourse,
    });
  }

  return attemptedCoursesResults;
};

export const useCourseData = (courseID) => {
  const DB_COURSE_KEY = "courses";
  const DB_STORAGE_KEY = `courseMaterials/${courseID}`;
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
      const firebaseKey = data.key;
      courseMap.set(courseID, {
        firebaseKey,
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
              firebaseKey,
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

export const useAttemptData = ({ userEmail }) => {
  const DB_COURSE_KEY = "courses";
  const coursesRef = ref(db, DB_COURSE_KEY);
  const [attemptedCourses, setAttemptedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseGidMap, setCourseGidMap] = useState(new Map());
  const [attemptCount, setAttemptCount] = useState(0);
  const [notAttemptCount, setNotAttemptCount] = useState(0);

  const [attemptedCourseMap, setAttemptedCourseMap] = useState(new Map());
  const [notAttemptedCourseMap, setNotAttemptedCourseMap] = useState(new Map());
  const { courseMap } = useCourseData();

  const spreadsheetId = "16HTIiiOq82Tm1tLHRQcr_8YJnO81QxZOOBOfR4hU3zc"; // Replace with your Sheet ID

  useEffect(() => {
    onChildAdded(coursesRef, (data) => {
      const { courseTitle, gid, courseID } = data.val();
      courseGidMap.set(courseID, { courseTitle, gid });
      setCourseGidMap(
        (prevMap) => new Map(prevMap.set(courseID, { courseTitle, gid }))
      );
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const attemptedCoursesResults = await fetchAttemptedCourses(
          spreadsheetId,
          courseGidMap,
          userEmail
        );

        setAttemptedCourses((prevCourses) => {
          const hasDuplicates = attemptedCoursesResults.some((newCourse) =>
            prevCourses.some(
              (prevCourse) => prevCourse.courseID === newCourse.courseID
            )
          );

          return hasDuplicates
            ? prevCourses
            : [...prevCourses, ...attemptedCoursesResults];
        });
      } catch (error) {
        console.error("Error fetching sheet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseGidMap, userEmail]);

  useEffect(() => {
    // attemptedCourses.forEach((course) => {
    //   course.hasAttempted
    //     ? setAttemptCount((prevCount) => prevCount + 1)
    //     : setNotAttemptCount((prevCount) => prevCount + 1);
    // });
    getAttemptedCourseMap();
    getNotAttemptedCourseMap();
  }, [attemptedCourses]);

  const getAttemptedCourseMap = () => {
    const courseArray = Array.from(courseMap.entries());
    const filteredArray = courseArray.filter(([courseID]) => {
      return attemptedCourses.some(
        (attemptedCourse) =>
          attemptedCourse.courseID === courseID && attemptedCourse.hasAttempted
      );
    });

    const newMap = new Map(filteredArray);
    setAttemptedCourseMap(newMap);
    console.log(newMap);
    console.log(newMap.size);
    setAttemptCount(newMap.size);
  };

  const getNotAttemptedCourseMap = () => {
    const courseArray = Array.from(courseMap.entries());
    const filteredArray = courseArray.filter(([courseID]) => {
      return !attemptedCourses.some(
        (attemptedCourse) =>
          attemptedCourse.courseID === courseID && attemptedCourse.hasAttempted
      );
    });

    const newMap = new Map(filteredArray);
    setNotAttemptedCourseMap(newMap);
    console.log(newMap);
    console.log(newMap.size);
    setNotAttemptCount(newMap.size);
  };
  return {
    attemptCount,
    notAttemptCount,
    attemptedCourseMap,
    notAttemptedCourseMap,
    isLoading,
  };
};
