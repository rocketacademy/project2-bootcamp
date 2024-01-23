import { useAttemptData } from "../components/FetchCourses";
import { CourseCards } from "../components/Card";
import { AuthContext } from "../pages/AuthProvider";
import { useContext } from "react";

const AttemptData = ({ userEmail }) => {
  const { attemptCount, notAttemptCount, notAttemptedCourseMap, isLoading } =
    useAttemptData({ userEmail });

  return (
    <div className="mt-8 pb-8 grid grid-cols-2 gap-x-8 gap-y-8 justify-items-center sm:grid-cols-6">
      {isLoading ? (
        <span className="loading loading-dots loading-lg col-span-2 sm:col-span-6"></span>
      ) : (
        <>
          <div className="stats shadow-xl col-span-1 bg-base-200 text-primary sm:col-start-2 sm:col-span-2">
            <div className="stat">
              <div className="stat-title">Courses Completed</div>
              <div className="stat-value">{attemptCount}</div>
              <div className="stat-desc">Keep it up!</div>
            </div>
          </div>
          <div className="stats shadow-xl col-span-1 bg-base-200 text-secondary sm:col-span-2">
            <div className="stat">
              <div className="stat-title">Incomplete Courses</div>
              <div className="stat-value">{notAttemptCount}</div>
              <div className="stat-desc">Hello?</div>
            </div>
          </div>
          <div className="w-full col-span-2 sm:col-start-2 sm:col-span-4">
            <h3>Not Attempted</h3>
            <div className="mb-8">
              <CourseCards courseMap={notAttemptedCourseMap} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const StudentHome = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <>
      <div className="prose grid grid-cols-1 p-6 max-w-full sm:grid-cols-6">
        <h1 className="text-center text-gray-600 sm:col-span-6">
          {currentUser && `Hello, ${currentUser.displayName}`}
        </h1>
        <div className="sm:col-span-6">
          {currentUser && <AttemptData userEmail={currentUser.email} />}
        </div>
      </div>
    </>
  );
};
