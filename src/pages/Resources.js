import { useNavigate } from "react-router-dom";
import { CourseCardsWithDelete } from "../components/Card";
import { useCourseData } from "../components/FetchCourses";

const Resources = () => {
  const { courseMap } = useCourseData();

  return (
    <>
      <div className="prose m-4 grid grid-cols-1 pb-8 gap-x-4 gap-y-6 max-w-full sm:grid-cols-5">
        <h1 className="text-center text-gray-600 sm:col-span-5">Courses</h1>
        <div className="sm:col-start-2 sm:col-span-3">
          <CourseCardsWithDelete initialCourseMap={courseMap} />
        </div>
      </div>
    </>
  );
};

export default Resources;
