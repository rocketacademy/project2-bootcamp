export const TextboxWithLabels = ({
  label,
  value,
  onChange,
  type,
  required,
}) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        type={type}
        placeholder="Type here"
        className="input input-bordered w-full"
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
};

export const TextboxWithoutLabels = ({
  inlineLabel,
  value,
  onChange,
  type,
}) => {
  return (
    <input
      type={type}
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
