import { useCourseData } from "../components/FetchCourses";

export const CourseCards = ({ courseMap }) => {
  const { courseMaterialsMap } = useCourseData();

  const CourseMaterialsButton = ({ cardCourseID }) => {
    return Array.from(courseMaterialsMap.entries()).map(
      ([key, materialsData]) =>
        materialsData.courseID === cardCourseID && (
          <a
            key={key}
            href={materialsData.url}
            className="btn btn-sm btn-outline max-w-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {materialsData.fileName}
          </a>
        )
    );
  };

  return Array.from(courseMap.entries()).map(([courseID, courseData]) => (
    <div
      key={courseID}
      className="card max-w-full bg-base-100 shadow-xl sm:col-start-3 col-span-3"
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge badge-base-100">
            Due Date: {courseData.dueDate}
          </div>
        </div>
        <h2 className="card-title">{courseData.courseTitle}</h2>
        <p className="text-start">{courseData.courseDescription}</p>
        <div className="card-actions justify-start">
          <CourseMaterialsButton cardCourseID={courseID} />
        </div>
        <div className="mt-5 card-actions justify-end">
          {/* Link to quizLink */}
          <a
            href={courseData.quizLink}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            TAKE QUIZ
          </a>
        </div>
      </div>
    </div>
  ));
};

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
