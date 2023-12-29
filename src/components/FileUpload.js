import { useState } from "react";

export const FileUpload = () => {
  const [fileInputFile, setFileInputFile] = useState(null);

  const handleFileUpload = (e) => {
    setFileInputFile(e.target.files[0]);
  };

  return (
    <>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Upload Course Materials</span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered"
          onChange={handleFileUpload}
        />
      </label>
      <div className="btn w-full">Upload</div>
    </>
  );
};
