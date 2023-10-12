//-----------React-----------//

//-----------Components-----------//
import Event from "../Components/Dates/Event.js";
import NavBar from "../Details/NavBar.js";
import CreateEvent from "../Components/Dates/CreateEvent.js";
import DateForm from "../Components/Dates/DateForm.js";

//-----------Media-----------//
import dates from "../Images/LogosIcons/word-icon-dates.png";
import SignInReminder from "../Components/Helpers/SignInReminder.js";

export default function DatesPage() {
  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center bg-background">
        <NavBar src={dates} />
        <main className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-3">
            <button className="px-2 hover:bg-slate-300">Upcoming</button>
            <button className="px-2 hover:bg-slate-300">Archive</button>
          </div>
          <Event
            date="6 November 2023"
            time="6pm"
            event="Cycling at ECP"
            detail="Bring a Helmet"
          />
          <Event
            date="6 November 2023"
            time="6pm"
            event="Cycling at ECP"
            detail="Bring a Helmet"
          />
          <Event
            date="6 November 2023"
            time="6pm"
            event="Cycling at ECP"
            detail="Bring a Helmet"
          />
          <Event
            date="6 November 2023"
            time="6pm"
            event="Cycling at ECP"
            detail="Bring a Helmet"
          />
          <DateForm />
        </main>
      </div>
    </>
  );
}
