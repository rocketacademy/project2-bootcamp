export const AssignCourseCard = ({ cardTitle, studentList }) => {
  return (
    <div className="card w-full max-w-xs bg-base-100 shadow-xl">
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
