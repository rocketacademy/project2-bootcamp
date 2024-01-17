import { useOutletContext, useParams } from "react-router-dom";
import DBHandler from "../Controller/DBHandler";
import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorPage from "../ErrorPage";
import "./SearchPage.css";

export default function SearchPage() {
  const [user] = useOutletContext();
  const { keyword } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage),
    [user.uid, setErrorMessage]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { resultInfo, adviceInfo } = await dbHandler.searchData(keyword);
        setResult(resultInfo);
        setAdvice(adviceInfo);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, [keyword, dbHandler]);

  const handleExpanded = (deckID) => {
    setExpanded((prev) => {
      if (prev === deckID) {
        return false;
      } else return deckID;
    });
  };

  const handleCopy = async (deckID) => {
    try {
      const isAlreadyTaken = await dbHandler.putExistingDeck(deckID);
      if (isAlreadyTaken) {
        setSnackBar("existed");
      } else {
        setSnackBar("copied");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const adviceList =
    advice &&
    advice.map((deck) => {
      const cardListBody = deck.cardInfos.map((card) => {
        return (
          <TableRow key={`card${card.cardID}`}>
            <TableCell>{card.english}</TableCell>
            <TableCell>{card.spanish}</TableCell>
          </TableRow>
        );
      });
      const cardList = (
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>English</TableCell>
                  <TableCell>Spanish</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{cardListBody}</TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            className="copy-button"
            onClick={() => handleCopy(deck.deckID)}
          >
            <div>Copy Deck</div>
            <ContentCopyIcon />
          </Button>
        </AccordionDetails>
      );
      return (
        <Accordion
          expanded={expanded === deck.deckID}
          key={`deck${deck.deckID}`}
          onChange={() => handleExpanded(deck.deckID)}
          className="search-list"
        >
          <AccordionSummary>
            <Typography sx={{ width: "30%" }}>Deck Name:</Typography>
            <Typography sx={{ width: "35%" }}>
              <b>{deck.deckName}</b>
            </Typography>
            <Typography sx={{ width: "30%" }}>Deck Cards: </Typography>
            <Typography sx={{ width: "5%" }}>
              {deck.deckCards.length}
            </Typography>
          </AccordionSummary>
          {cardList}
        </Accordion>
      );
    });

  const resultList =
    result &&
    result.map((deck) => {
      const cardListBody = deck.cardInfos.map((card) => {
        return (
          <TableRow key={`card${card.cardID}`}>
            <TableCell>{card.english}</TableCell>
            <TableCell>{card.spanish}</TableCell>
          </TableRow>
        );
      });
      const cardList = (
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>English</b>
                  </TableCell>
                  <TableCell>
                    <b>Spanish</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{cardListBody}</TableBody>
            </Table>
          </TableContainer>
          <div>
            <Button
              variant="contained"
              className="copy-button"
              onClick={() => handleCopy(deck.deckID)}
            >
              <div>Copy Deck</div>
              <ContentCopyIcon />
            </Button>
          </div>
        </AccordionDetails>
      );
      return (
        <Accordion
          className="search-list"
          expanded={expanded === deck.deckID}
          key={`deck${deck.deckID}`}
          onChange={() => handleExpanded(deck.deckID)}
        >
          <AccordionSummary>
            <Typography sx={{ width: "30%" }}>Deck Name:</Typography>
            <Typography sx={{ width: "35%" }}>
              <b>{deck.deckName}</b>
            </Typography>
            <Typography sx={{ width: "30%" }}>Deck Cards: </Typography>
            <Typography sx={{ width: "5%" }}>
              {deck.deckCards.length}
            </Typography>
          </AccordionSummary>
          {cardList}
        </Accordion>
      );
    });

  const resultDisplay = result && !!result.length && <div>{resultList}</div>;

  const adviceDisplay = advice && !!advice.length && (
    <div>
      <div>You may also interested in:</div>
      <div>{adviceList}</div>
    </div>
  );

  const displayList = (
    <div>
      {resultDisplay}
      <br />
      {adviceDisplay}
    </div>
  );

  const display = result ? (
    displayList
  ) : (
    <Backdrop open={!result}>
      <h3>Searching Deck</h3>
      <h1>
        <CircularProgress color="inherit" />
      </h1>
    </Backdrop>
  );

  const pageHeader = (
    <div className="search-header">
      {result && result.length
        ? `${result.length} results of keyword "${keyword}" found:`
        : `No result of "${keyword}"`}
    </div>
  );
  return (
    <div className="search-page">
      {pageHeader}
      {display}
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <Snackbar
        open={!!snackBar}
        autoHideDuration={1000}
        onClose={() => setSnackBar(false)}
        message={
          snackBar === "copied"
            ? `Deck Copied!`
            : snackBar === "existed"
            ? `You already have this deck.`
            : null
        }
      />
    </div>
  );
}
