import { useNavigate } from "react-router-dom";
import { CourseCardsWithDelete } from "../components/Card";
import { useCourseData } from "../components/FetchCourses";

const Resources = () => {
  const navigate = useNavigate();
  const { courseMap } = useCourseData();

  return (
    <>
      <div className="prose m-4 grid grid-cols-1 pb-8 gap-x-4 gap-y-6 max-w-full sm:grid-cols-5">
        <h1 className="text-center sm:col-span-5">Courses</h1>
        <div className="sm:col-start-2 sm:col-span-3">
          <CourseCardsWithDelete initialCourseMap={courseMap} />
        </div>
      </div>
    </>
  );
};

export default Resources;

{
  /* <div className="grid justify-items-stretch grid-cols-3  gap-5 font-bold">
          <div className="card bg-yellow-100 text-sm w-48 h-32 items-center justify-center mb-6">
            <button onClick={() => navigate("courseform")}>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          <div className="card bg-pink-300 text-sm w-48 h-32 items-center justify-center mb-6">
            <button> Resource 6</button>
          </div>
          <div className="card bg-green-600 text-sm w-48 h-32 items-center justify-center mb-6">
            <button>Resource 5</button>
          </div>
          <div className="card bg-blue-300 text-sm w-48 h-32 items-center justify-center mb-6">
            <button>Resource 4</button>
          </div>
          <div className="card bg-yellow-300 text-sm w-48 h-32  items-center justify-center mb-6">
            <button> Resource 3</button>
          </div>
          <div className="card bg-orange-500 text-sm w-48 h-32  items-center justify-center mb-6">
            <button> Resource 2</button>
          </div>
          <div className="card bg-gray-400 text-sm w-48 h-32 items-center justify-center">
            <button> Resource 1</button>
          </div> */
}
{
  /* </div> */
}
