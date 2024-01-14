import { useCourseData } from "../components/FetchCourses";

export const AssignCourseCard = ({ cardTitle, studentList }) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{cardTitle}</h2>
        <label className="flex items-center">
          <input type="checkbox" />
          <div className="label">
            <span className="label-text">Student 1</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export const CardWithoutActions = ({ cardContent }) => {
  return (
    <div className="card w-full bg-base-100 shadow-md">
      <div className="card-body">
        <p>{cardContent}</p>
      </div>
    </div>
  );
};

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
      className="card max-w-full mb-8 bg-base-100 shadow-xl sm:col-start-2 sm:col-span-5"
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
