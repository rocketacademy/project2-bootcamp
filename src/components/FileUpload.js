export const FileUploadWithLabel = ({ label, handleFileUpload }) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input type="file" className="file-input file-input-bordered w-full" />
    </label>
  );
};
