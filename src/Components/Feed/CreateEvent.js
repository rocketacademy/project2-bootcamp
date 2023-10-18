const CreateEvent = ({ handleClick }) => {
  return (
    <button
      onClick={handleClick}
      className=" flex h-[2.5em] w-[2.5em] items-center justify-center rounded-full bg-window p-1 text-[28px] leading-none shadow-xl hover:translate-y-[-2px] hover:bg-text "
    >
      📝
    </button>
  );
};

export default CreateEvent;
