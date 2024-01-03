import { ref, get } from "firebase/database";
import { database } from "../firebase";
import { Card, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Study.css";

export default function HomePage() {
  const [user, setUser] = useOutletContext();
  const [userDeckIDs, setUserDeckIDs] = useState();
  const [userDecks, setUserDecks] = useState([]);

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
  }, []);

  const navigate = useNavigate();

  const handleClick = (deckID) => {
    navigate(`/study/${deckID}`);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //component show the decks option
  const deckList = Array.isArray(userDeckIDs) ? (
    userDeckIDs.map((deckID) => {
      const deckName = userDecks[`deck${deckID}`].deckName;
      const cardsNum = userDecks[`deck${deckID}`].deckCards.length;
      return (
        <Card key={deckName} style={{ marginBottom: "10px" }}>
          <div className="options">
            <Button onClick={handleMenu}>:</Button>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
            <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
            <MenuItem onClick={handleMenuClose}>Copy</MenuItem>
          </Menu>
          <h4 onClick={() => handleClick(deckID)}>{deckName}</h4>
          <p>{cardsNum} cards</p>
        </Card>
      );
    })
  ) : (
    <p>You have 0 deck</p>
  );

  return (
    <div>
      <div>Hi, {user.displayName ? user.displayName : "user"}.</div>
      <p>Your current deck:</p>
      {deckList}
    </div>
  );
}
