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
