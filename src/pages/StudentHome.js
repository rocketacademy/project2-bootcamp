import { useAttemptData } from "../components/FetchCourses";
import { CourseCards } from "../components/Card";

const AttemptData = ({ userEmail }) => {
  const {
    attemptCount,
    notAttemptCount,
    attemptedCourseMap,
    notAttemptedCourseMap,
    isLoading,
  } = useAttemptData({ userEmail });

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
          {/* <div className="hidden sm:block w-full col-span-2 sm:col-span-3">
            <h3>Completed</h3>
            <div className="mb-8">
              <CourseCards courseMap={attemptedCourseMap} />
            </div>
            {attemptedCourses
              .filter((course) => course.hasAttempted)
              .map((course) => (
                <div key={course.courseTitle} className="mb-8">
                  <CardWithoutActions cardContent={course.courseTitle} />
                </div>
              ))}
          </div> */}

          <div className="w-full col-span-2 sm:col-start-2 sm:col-span-4">
            <h3>Not Attempted</h3>
            <div className="mb-8">
              <CourseCards courseMap={notAttemptedCourseMap} />
            </div>
            {/* {attemptedCourses
              .filter((course) => !course.hasAttempted)
              .map((course) => (
                <div key={course.courseTitle} className="mb-8">
                  <CardWithoutActions cardContent={course.courseTitle} />
                </div>
              ))} */}
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
