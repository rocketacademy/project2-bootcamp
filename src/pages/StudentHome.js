import React, { useState, useEffect } from "react";
import { ref, onChildAdded } from "firebase/database";
import { db } from "../firebase";
import { CardWithoutActions } from "../components/Card";
import { fetchAttemptedCourses } from "../components/FetchCourses";

const AttemptData = ({ userEmail }) => {
  const DB_COURSE_KEY = "courses";
  const coursesRef = ref(db, DB_COURSE_KEY);
  const [attemptedCourses, setAttemptedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseGidMap, setCourseGidMap] = useState(new Map());
  const [attemptCount, setAttemptCount] = useState(0);
  const [notAttemptCount, setNotAttemptCount] = useState(0);

  const spreadsheetId = "16HTIiiOq82Tm1tLHRQcr_8YJnO81QxZOOBOfR4hU3zc"; // Replace with your Sheet ID

  useEffect(() => {
    onChildAdded(coursesRef, (data) => {
      const { courseTitle, gid } = data.val();
      courseGidMap.set(courseTitle, gid);
      setCourseGidMap((prevMap) => new Map(prevMap.set(courseTitle, gid)));
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
              (prevCourse) => prevCourse.courseTitle === newCourse.courseTitle
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
  }, [attemptedCourses]);

  return (
    <div className="mt-8 pb-8 grid grid-cols-2 gap-x-8 gap-y-8 justify-items-center sm:grid-cols-6">
      {isLoading ? (
        <span className="loading loading-dots loading-lg col-span-2 sm:col-span-6"></span>
      ) : (
        <>
          <div className="stats shadow col-span-1 sm:col-span-3">
            <div className="stat">
              <div className="stat-title">Courses Completed</div>
              <div className="stat-value">{attemptCount}</div>
              <div className="stat-desc">Keep it up!</div>
            </div>
          </div>
          <div className="stats shadow col-span-1 sm:col-span-3">
            <div className="stat">
              <div className="stat-title">Incomplete Courses</div>
              <div className="stat-value">{notAttemptCount}</div>
              <div className="stat-desc">Hello?</div>
            </div>
          </div>
          <div className="hidden sm:block w-full col-span-2 sm:col-span-3">
            <h3>Completed</h3>
            {attemptedCourses
              .filter((course) => course.hasAttempted)
              .map((course) => (
                <div key={course.courseTitle} className="mb-8">
                  <CardWithoutActions cardContent={course.courseTitle} />
                </div>
              ))}
          </div>

          <div className="w-full col-span-2 sm:col-span-3">
            <h3>Not Attempted</h3>
            {attemptedCourses
              .filter((course) => !course.hasAttempted)
              .map((course) => (
                <div key={course.courseTitle} className="mb-8">
                  <CardWithoutActions cardContent={course.courseTitle} />
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export const StudentHome = () => {
  return (
    <>
      <div className="prose grid grid-cols-1 p-6 max-w-full sm:grid-cols-6">
        <h1 className="text-center sm:col-span-6">Dashboard</h1>
        <div className="sm:col-span-6">
          <AttemptData userEmail={"imhongyun@gmail.com"} />
        </div>
      </div>
    </>
  );
};
