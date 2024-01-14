import { CourseCards } from "../components/Card";
import { useCourseData } from "../components/FetchCourses";

export const StudentCourses = () => {
  const { courseMap } = useCourseData();
  return (
    <>
      <div className="prose grid grid-cols-1 gap-y-8 p-6 max-w-full sm:grid-cols-7">
        <h1 className="text-center sm:col-start-3 col-span-3">Courses</h1>
        <CourseCards courseMap={courseMap} />
      </div>
    </>
  );
};
