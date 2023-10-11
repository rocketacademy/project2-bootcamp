export default function Event({ date, time, event, detail }) {
  //function to count the number of days

  return (
    <div className="modal-box flex w-[20em] max-w-md flex-row items-center rounded-md bg-window p-2 hover:translate-y-[-2px]">
      <header className="flex flex-col items-center justify-center border-r-[1.5px] border-black p-2">
        <p>7</p>
        <p>days</p>
      </header>

      <article className="flex flex-col p-2">
        <h1 className="font-bold text-accent">{date}</h1>
        <time>{time}</time>
        <h1>{event}</h1>
        {/* <p>{detail}</p> */}
      </article>
      <button className="absolute right-2 top-2 rounded-full p-1.5 p-1.5 leading-none hover:bg-text">
        ✕
      </button>
      <button className="absolute bottom-2 right-2 rounded-full p-1.5 leading-none hover:bg-text">
        🗓️
      </button>
    </div>
  );
}
