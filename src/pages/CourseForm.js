export const CourseForm = () => {
  return (
    <>
      <div className="">
        <p className="text-xl">Create A Course</p>

        <form>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Course Title</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Course Description</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Upload File</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </label>
        </form>
      </div>
    </>
  );
};
