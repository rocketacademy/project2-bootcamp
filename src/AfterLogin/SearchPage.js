import { useOutletContext, useParams } from "react-router-dom";
import DBHandler from "../Controller/DBHandler";
import { useEffect, useMemo, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorPage from "../ErrorPage";

export default function SearchPage() {
  const [user] = useOutletContext();
  const { keyword } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState();
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage),
    [user.uid, setErrorMessage]
  );

  useEffect(() => {
    const searchData = async () => {
      try {
        await dbHandler.searchDeck(keyword);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    searchData();
  });

  const resultDisplay = <div></div>;

  const display = result ? (
    resultDisplay
  ) : (
    <Backdrop open={!result}>
      <h3>Searching Deck</h3>
      <h1>
        <CircularProgress color="inherit" />
      </h1>
    </Backdrop>
  );
  return (
    <div>
      {display}
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
    </div>
  );
}
