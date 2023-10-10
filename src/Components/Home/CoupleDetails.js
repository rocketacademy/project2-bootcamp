import heart from "../../Images/heart.gif";

const CoupleDetails = () => {
  //Import display photos
  return (
    <article className=" flex w-1/2 min-w-[16em] max-w-[28em] flex-col items-center rounded-xl bg-white bg-opacity-80 p-2 shadow-xl hover:animate-pulse">
      <img src={heart} alt="heartbeat" className=" h-[4em] w-[4em]"></img>
      <h1 className="text-[1em]">Rick & Morty</h1>

      <h1 className="text-[3em] font-bold leading-none">420 days</h1>
      <p className="text-[1em]">Together</p>
    </article>
  );
};

export default CoupleDetails;
