import memories from "../../Images/LogosIcons/icon-memories.png";
const CreateButton2 = ({ handleClick }) => {
  return (
    <div>
      <button
        onClick={handleClick}
        className="flex w-[55px] items-center justify-center rounded-md px-2 py-1 leading-none hover:bg-slate-500  "
      >
        <img src={memories} alt="memories" />
      </button>
    </div>
  );
};

export default CreateButton2;
