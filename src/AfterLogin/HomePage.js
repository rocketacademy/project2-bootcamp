import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import { Card, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Study.css";

export default function HomePage() {
  const [user] = useOutletContext();
  const [userDeckIDs, setUserDeckIDs] = useState();
  const [userDecks, setUserDecks] = useState([]);
  const [selectedDeckIDs, setSelectedDeckIDs] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const takeDecksInfo = async () => {
      //Taking the decks Info
      const decksRef = ref(database, `decks`);
      return await get(decksRef);
    };

    const takeDeckIDsInfo = async () => {
      //Taking the user Decks
      const userDecksRef = ref(database, `userInfo/${user.uid}/decks`);
      return await get(userDecksRef);
    };

    const takeAllInfo = async () => {
      const [newDecksIDs, newDecks] = await Promise.all([
        takeDeckIDsInfo(),
        takeDecksInfo(),
      ]);
      setUserDeckIDs(newDecksIDs.val());
      setUserDecks(newDecks.val());
    };
    takeAllInfo();
  }, [user.uid]);

  const handleClick = (deckID) => {
    navigate(`/study/${deckID}`);
  };

  const handleEdit = (deckID) => {
    navigate(`/editDeck/${deckID}`);
  };

  const handleDelete = async (deckID) => {
    const userDeckIDsRef = ref(database, `userInfo/${user.uid}/decks/`);
    const deleteDeckIndex = userDeckIDs.findIndex(
      (userDeckID) => userDeckID === deckID
    );
    const newUserDeckIDs = userDeckIDs.toSpliced(deleteDeckIndex, 1);
    try {
      await set(userDeckIDsRef, newUserDeckIDs);
      setUserDeckIDs(newUserDeckIDs);
      setAnchorEl(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenu = (event, deckID) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeckIDs(deckID);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //component show the decks option
  const deckList = Array.isArray(userDeckIDs) ? (
    userDeckIDs.map((deckID) => {
      const deckName = userDecks[`deck${deckID}`].deckName;
      const cardsNum = Object.keys(userDecks[`deck${deckID}`].deckCards).length;

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
            <MenuItem onClick={() => handleEdit(selectedDeckIDs)}>
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(deckID)}>Delete</MenuItem>
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
      <div>Hi, {user.displayName ? user.displayName : "student"}.</div>
      <p>Your current deck:</p>
      {deckList}
    </div>
  );
}
