export const TextboxWithLabels = ({ label, value, onChange }) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export const TextboxWithoutLabels = ({ inlineLabel, value, onChange }) => {
  return (
    <label className="form-control w-full max-w-xs">
      <input
        type="text"
        placeholder={inlineLabel}
        className="input input-bordered w-full max-w-xs"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};
