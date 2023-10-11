export default function Event() {
  return (
    <div className="modal-box flex w-full max-w-md flex-row items-center rounded-md bg-window p-2">
      <header className="flex flex-col items-center justify-center border-r-[1.5px] p-2">
        <p>7</p>
        <p>days</p>
      </header>

      <article className="flex flex-col p-2">
        <h1 className="font-bold text-accent">6 October 2023 (Friday)</h1>
        <time> 6:00 pm</time>
        <title>Cycling at East Coast Park</title>
        <p>Bring a helmet!</p>
      </article>
      <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
        ✕
      </button>
    </div>
  );
}
