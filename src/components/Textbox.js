export const TextboxWithLabels = ({ label, value, onChange }) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export const TextboxWithoutLabels = ({ inlineLabel, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={inlineLabel}
      className="input input-bordered w-full"
      value={value}
      onChange={onChange}
    />
  );
};

export const DateInputWithLabels = ({ label, value, onChange }) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        type="date"
        className="input input-bordered w-full"
        value={value}
        onChange={onChange}
        pattern="\d{4}-\d{2}-\d{2}"
      />
    </label>
  );
};
