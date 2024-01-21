import { useState } from "react";
import { CourseCards, CourseCardsWithCert } from "../components/Card";
import { useCourseData, useAttemptData } from "../components/FetchCourses";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const AttemptedCourses = ({ userEmail }) => {
  const { currentUser } = useContext(AuthContext);
  const { attemptedCourseMap, isLoading } = useAttemptData({ userEmail });
  return isLoading ? (
    <span className="loading loading-dots loading-lg place-self-center sm:col-start-4 sm:col-span-1"></span>
  ) : (
    <>
      <h3 className="sm:col-span-7">Completed</h3>
      <CourseCardsWithCert
        courseMap={attemptedCourseMap}
        displayName={currentUser.displayName}
      />
    </>
  );
};

const NotAttemptedCourses = ({ userEmail }) => {
  const { notAttemptedCourseMap, isLoading } = useAttemptData({ userEmail });
  return isLoading ? (
    <span className="loading loading-dots loading-lg place-self-center sm:col-start-4 sm:col-span-1"></span>
  ) : (
    <>
      <h3 className="sm:col-span-7">Not Attempted</h3>
      <CourseCards courseMap={notAttemptedCourseMap} />
    </>
  );
};

export const StudentCourses = ({ userEmail }) => {
  const { courseMap } = useCourseData();
  const [notAttempted, setNotAttempted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [allCourses, setAllCourses] = useState(false);
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <div className="prose grid grid-cols-1 p-6 max-w-full sm:grid-cols-7">
        <h1 className="text-center sm:col-span-7">Courses</h1>

        <div className="form-control sm:col-start-2 sm:col-span-1">
          <label className="label cursor-pointer">
            <span className="label-text">All Courses</span>
            <input
              type="checkbox"
              checked={allCourses}
              className="checkbox"
              onChange={() => setAllCourses(!allCourses)}
            />
          </label>
        </div>
        <div className="form-control sm:col-start-4 sm:col-span-1">
          <label className="label cursor-pointer">
            <span className="label-text">Not Attempted</span>
            <input
              type="checkbox"
              checked={notAttempted}
              className="checkbox"
              onChange={() => setNotAttempted(!notAttempted)}
            />
          </label>
        </div>
        <div className="form-control sm:col-start-6 sm:col-span-1">
          <label className="label cursor-pointer">
            <span className="label-text">Completed</span>
            <input
              type="checkbox"
              checked={attempted}
              className="checkbox"
              onChange={() => setAttempted(!attempted)}
            />
          </label>
        </div>

        {allCourses === true && <CourseCards courseMap={courseMap} />}
        {attempted === true && (
          <AttemptedCourses userEmail={"imhongyun@gmail.com"} />
        )}
        {notAttempted === true && (
          <NotAttemptedCourses userEmail={"imhongyun@gmail.com"} />
        )}
      </div>
    </>
  );
};
