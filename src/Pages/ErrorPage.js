//-----------React-----------//
import { useRouteError } from "react-router-dom";
//-----------Components-----------//
import NavBar from "../Details/NavBar";
//-----------Media-----------//
import confused from "../Images/LogosIcons/emo-confused.png";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <NavBar />
        <img src={confused} alt="confused" className="h-[8em]" />
        <h1 className="text-xl font-bold">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="m-2 rounded-xl border-2 border-slate-500 p-3">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
}
