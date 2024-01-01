import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { TextField } from "@mui/material";

import { Button } from "@mui/material";
import { AppLinks } from "../AppMain";

const drawerWidth = 380;

const linkStyle = {
  // marginRight: "50px",
  // marginLeft: "50px",
  // marginTop: "10px",
  // marginBottom: "10px",
  // textDecoration: "none",
  // color: "black",
  // fontWeight: "bold",
  // fontSize: "30px",
  display: "flex",
  flexDirection: "column",
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({
  logoutButton,
  aiResponse,
  clearAIResponse,
  onDrawerOpen,
  sendMessage,
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userMessage, setUserMessage] = React.useState("");

  React.useEffect(() => {
    if (onDrawerOpen) {
      // When prop changes (i.e., passed from parent component), it sets handleDrawerOpen function as the reference received
      onDrawerOpen(handleDrawerOpen);
    }
  }, [onDrawerOpen]); // Watching for changes to onDrawerOpen prop

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap component="div">
            Merlion Landmarks
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItem sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ marginBottom: "20px", width: "75%" }}>
              <Button
                variant="contained"
                onClick={() => {
                  const message = "Singapore Flyer's history in 1 sentence";
                  sendMessage(message);
                }}
                sx={{ width: "50%", marginBottom: "20px" }}
              >
                Singapore Flyer
              </Button>
            </Box>
            <Box sx={{ marginBottom: "20px", width: "75%" }}>
              <Button
                variant="contained"
                onClick={() => {
                  const message = "Sentosa Island's history in 1 sentence";
                  sendMessage(message);
                }}
                sx={{ width: "50%" }}
              >
                Sentosa Island
              </Button>
            </Box>
            <Box sx={{ marginBottom: "20px", width: "75%" }}>
              <Button
                variant="contained"
                onClick={() => {
                  const message = "Singapore Chinatown's history in 1 sentence";
                  sendMessage(message);
                }}
                sx={{ width: "50%" }}
              >
                Chinatown SG
              </Button>
            </Box>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              {logoutButton && <ListItemIcon>{logoutButton}</ListItemIcon>}
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Box>
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

        <Box>
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
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
