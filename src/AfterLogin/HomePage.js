import { Card, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import DBhandler from "./Controller/DBhandler";

export default function HomePage() {
  const [user] = useOutletContext();
  const [userDecks, setUserDecks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedID, setSelectedID] = useState();
  const navigate = useNavigate();
  const dbHandler = useMemo(
    () => new DBhandler(user.uid, setErrorMessage),
    [user.uid, setErrorMessage]
  );

  useEffect(() => {
    const takeDecksAndIDsInfo = async () => {
      try {
        const { userDecks } = await dbHandler.getUserAndDecksInfo(false);
        setUserDecks(userDecks);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    takeDecksAndIDsInfo();
  }, [dbHandler]);

  const handleClick = (deckID) => {
    navigate(`/study/${deckID}`);
  };

  const handleEdit = () => {
    navigate(`/editDeck/${selectedID}`);
  };

  const handleDelete = async (deckID) => {
    try {
      const newUserDeck = await dbHandler.deleteUserDeck(deckID);
      setUserDecks(newUserDeck);
      setSelectedID(null);
      setAnchorEl(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleMenu = (event, deckID) => {
    setSelectedID(deckID);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //component show the decks option
  const deckList = userDecks.length ? (
    userDecks.map((deck) => {
      const deckName = deck.deckName;
      const cardsNum = deck.deckCards.length;
      const deckID = deck.deckID;
      return (
        <Card
          key={deckID}
          style={{ marginBottom: "10px" }}
          className="homepage-deck"
        >
          <div className="options">
            <Button onClick={(event) => handleMenu(event, deckID)}>:</Button>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem value={deckID} onClick={(e) => handleEdit(e.value)}>
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedID)}>Delete</MenuItem>
          </Menu>
          <div onClick={() => handleClick(deckID)}>
            <h4>{deckName}</h4>
            <p>{cardsNum} cards</p>
          </div>
        </Card>
      );
    })
  ) : (
    <p>You have 0 deck</p>
  );

  return (
    <div>
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <div>Hi, {user.displayName ? user.displayName : "student"}.</div>
      <p>Your current deck:</p>
      {deckList}
    </div>
  );
}
