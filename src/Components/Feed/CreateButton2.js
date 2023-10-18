import memories from "../../Images/LogosIcons/icon-memories-no-bg.png";
const CreateButton2 = ({ handleClick }) => {
  return (
    <div>
      <button
        onClick={handleClick}
        className="flex w-[40px] items-center justify-center rounded-full leading-none hover:bg-slate-400  "
      >
        <img src={memories} alt="memories" />
      </button>
    </div>
  );
};

export default CreateButton2;
