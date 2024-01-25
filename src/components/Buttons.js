const Buttons = ({ label }) => {
  return (
    <>
      <div>
        <button
          type="submit"
          className="text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6"
        >
          {label}
        </button>
      </div>
    </>
  );
};
export default Buttons;
