import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AttractionsIcon from "@mui/icons-material/Attractions";
import SailingIcon from "@mui/icons-material/Sailing";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import { IconButton } from "@mui/material";
import ExitToApp from "@mui/icons-material/ExitToApp";
import { TextField } from "@mui/material";
import { Typography } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function TemporaryDrawer({
  logoutButton,
  aiResponse,
  clearAIResponse,
  onDrawerOpen,
  sendMessage,
  handleAuthStateChanged,
  handleLogout,
  isLoggedIn,
  loading
}) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [userMessage, setUserMessage] = React.useState("");

  const toggleDrawer = (anchor, open) => (event) => {
    // toggleDrawer is a higher order function that accepts the left and true/false arguments and returns an event object (e.g., can be a keydown or tab/shift)
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  React.useEffect(() => {
    if (aiResponse) {
      // set the state of left to be true so that the drawer can be opened
      setState({ ...state, left: true });
    }
  }, [aiResponse]);

  React.useEffect(() => {
    handleAuthStateChanged();
  }, [handleAuthStateChanged]);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 380 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <List>
          {["Singapore Flyer", "Sentosa Island", "Chinatown Singapore"].map(
            (text, index) => (
              <ListItemButton key={text}>
                <ListItemIcon>
                  {text === "Singapore Flyer" ? (
                    <IconButton
                      variant="contained"
                      onClick={() => {
                        const message =
                          "Singapore Flyer's history in 1 sentence";
                        sendMessage(message);
                      }}
                      sx={{ width: "50%", marginBottom: "20px" }}
                    >
                      <AttractionsIcon />
                    </IconButton>
                  ) : text === "Sentosa Island" ? (
                    <IconButton
                      variant="contained"
                      onClick={() => {
                        const message =
                          "Sentosa Island's history in 1 sentence";
                        sendMessage(message);
                      }}
                      sx={{ width: "50%", marginBottom: "20px" }}
                    >
                      <SailingIcon />
                    </IconButton>
                  ) : text === "Chinatown Singapore" ? (
                    <IconButton
                      variant="contained"
                      onClick={() => {
                        const message =
                          "Chinatown Singapore's history in 1 sentence";
                        sendMessage(message);
                      }}
                      sx={{ width: "50%", marginBottom: "20px" }}
                    >
                      <TakeoutDiningIcon />
                    </IconButton>
                  ) : null}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  onClick={() => {
                    const message = `${text}'s history in 1 sentence`;
                    sendMessage(message);
                  }}
                />
              </ListItemButton>
            )
          )}
        </List>
      </List>
      <Divider />
      <Box sx={{ marginLeft: "10px" }}>
        <TextField
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <Button
          variant="contained"
          // onClick={sendMessage}
          onClick={() => {
            sendMessage(userMessage);
          }}
          sx={{ mt: "20px", mb: "20px" }}
        >
          Send Message
        </Button>
      </Box>
      <Divider />
      <Box sx={{ marginLeft: "10px" }}>
        <Box className="ai-response">
          <Typography
            variant="h4"
            sx={{ fontFamily: "Comic Sans MS", color: "primary.main" }}
          >
            AI Response:
          </Typography>
          <p>{aiResponse}</p>
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={clearAIResponse}
            sx={{ mt: "20px", mb: "20px" }}
          >
            Clear
          </Button>
        </Box>
        <IconButton
          variant="outlined"
          onClick={(e) => {
            handleLogout();
            signOut(auth);
          }}
          sx={{ marginLeft: "10px" }}
          starticon={<ExitToApp />}
        >
          <ExitToApp style={{ fontSize: "2.25rem" }} />
        </IconButton>
      </Box>
    </Box>
  );


  return (
    <div>
      {/* {["left", "right", "top", "bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))} */}
      <React.Fragment>
        <Button onClick={toggleDrawer("left", true)}>
          <MenuIcon />
        </Button>
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
