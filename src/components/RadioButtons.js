const RadioButtons = ({ label, value, id, checked, onChange }) => {
  return (
    <div className="flex items-center me-4">
      <input
        id={id}
        type="radio"
        value={value}
        name="role-radio-group"
        className="w-4 h-4 text-blue-600 bg-gray-100"
        checked={checked}
        onChange={onChange}
      />
      <span className="ms-2 text-sm font-medium ">{label}</span>
    </div>
  );
};
export default RadioButtons;
