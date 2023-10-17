//-----------Components-----------//
import JournalForm from "../Components/Journal/JournalForm.js";
import NavBar from "../Details/NavBar.js";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

//-----------Media-----------//
import JournalImage from "../Images/LogosIcons/word-icon-journal.png";

//Database key for date-list
const REALTIME_DATABASE_KEY_JOURNAL = "Journal-list";

export default function JournalListPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar src={JournalImage} />
      <main className="mt-[110px] flex flex-col items-center justify-start">
        <div className="bucket-lists max-w-screen m-4 grid justify-center gap-4 p-3 md:grid-cols-1 lg:grid-cols-3">
          <JournalForm />
        </div>
      </main>
    </div>
  );
}
