const Buttons = ({ label }) => {
  return (
    <>
      <div>
        <button type="submit" className="btn btn-info">
          {label}
        </button>
      </div>
    </>
  );
};
export default Buttons;
