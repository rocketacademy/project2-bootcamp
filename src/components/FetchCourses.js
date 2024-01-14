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
    attemptedCourses.forEach((course) => {
      course.hasAttempted
        ? setAttemptCount((prevCount) => prevCount + 1)
        : setNotAttemptCount((prevCount) => prevCount + 1);
    });
    getAttemptedCourseMap();
    getNotAttemptedCourseMap();
  }, [attemptedCourses]);

  const getAttemptedCourseMap = () => {
    const courseArray = Array.from(courseMap.entries());
    const filteredArray = courseArray.filter(([courseID, courseData]) => {
      return attemptedCourses.some(
        (attemptedCourse) =>
          attemptedCourse.courseID === courseID && attemptedCourse.hasAttempted
      );
    });
    setAttemptedCourseMap((prevMap) => {
      const newMap = new Map(prevMap);
      filteredArray.forEach(([courseID, courseData]) => {
        newMap.set(courseID, courseData);
      });
      return newMap;
    });
  };

  const getNotAttemptedCourseMap = () => {
    const courseArray = Array.from(courseMap.entries());
    const filteredArray = courseArray.filter(([courseID, courseData]) => {
      return !attemptedCourses.some(
        (attemptedCourse) =>
          attemptedCourse.courseID === courseID && attemptedCourse.hasAttempted
      );
    });
    setNotAttemptedCourseMap((prevMap) => {
      const newMap = new Map(prevMap);
      filteredArray.forEach(([courseID, courseData]) => {
        newMap.set(courseID, courseData);
      });
      return newMap;
    });
  };
  return {
    attemptCount,
    notAttemptCount,
    attemptedCourseMap,
    notAttemptedCourseMap,
    isLoading,
  };
};
