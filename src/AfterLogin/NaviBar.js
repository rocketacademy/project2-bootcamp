import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import { signOut, updateProfile } from "firebase/auth";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { auth } from "../firebase";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  Input,
  Menu,
  MenuItem,
  Slide,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
import StorageHandler from "../Controller/StorageHandler";
import logo from "../img/logo.jpg";

export default function NaviBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [keyword, setKeyWord] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const naviBarRef = useRef();
  const navi = useNavigate();
  const dbHandler = useMemo(
    () => new DBHandler(props.user.uid, setErrorMessage),
    [props.user.uid, setErrorMessage]
  );
  const stroageHandler = useMemo(
    () => new StorageHandler(setErrorMessage),
    [setErrorMessage]
  );
  useEffect(() => {
    const getProfilePics = async () => {
      try {
        const userInfo = await dbHandler.getUserInfo(false);
        const userPicURL = userInfo.profilePic;
        setProfilePicUrl(userPicURL);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getProfilePics();
  }, [dbHandler]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  const handleSighOut = () => {
    signOut(auth);
  };

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleChangeName = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      props.setUser({ ...auth.currentUser });
      setName("");
      setOpenDialog("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      const url = await stroageHandler.postPhoto(props.user.uid, file);
      await dbHandler.putUserPicURL(url);
      setProfilePicUrl(url);
      setFile("");
      setOpenDialog("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const largeWindowDisplay = (
    <div className="navi-bar" ref={naviBarRef}>
      <Link to="/">
        <img src={logo} alt="logo" className="navi-logo" />
      </Link>

      <div className="navi-icon-div">
        <Slide in={openSearch} direction="left" container={naviBarRef.current}>
          <div className="large-search-bar">
            <Input
              value={keyword}
              onChange={(e) => setKeyWord(e.target.value)}
              className="search-bar-input"
            />
            <SearchIcon
              onClick={() => {
                navi(`/search/${keyword}`);
              }}
            />
            <ChevronRightIcon onClick={() => setOpenSearch(false)} />
          </div>
        </Slide>
        <SearchIcon onClick={() => setOpenSearch(true)} />
        <Link to="/addDeck">
          <AddCircleOutlineIcon />
        </Link>
        <Link to="/quiz">
          <QuizIcon />
        </Link>
        <Link to="/report">
          <LeaderboardIcon />
        </Link>
        <Avatar
          onClick={handleOpenMenu}
          src={profilePicUrl}
          className="profile-pic"
        />
      </div>
    </div>
  );

  const smallWindowDisplay = (
    <div className="navi-bar" ref={naviBarRef}>
      <Link to="/">
        <img src={logo} alt="logo" className="navi-logo" />
      </Link>
      <Slide in={openSearch} direction="left" container={naviBarRef.current}>
        <div className="small-search-bar">
          <Input
            value={keyword}
            onChange={(e) => setKeyWord(e.target.value)}
            className="search-bar-input"
          />
          <SearchIcon
            onClick={() => {
              navi(`/search/${keyword}`);
            }}
          />
          <ChevronRightIcon onClick={() => setOpenSearch(false)} />
        </div>
      </Slide>
      <Slide in={!openSearch} direction="left" container={naviBarRef.current}>
        <div className="navi-icon-div">
          <SearchIcon onClick={() => setOpenSearch(true)} />
          <Link to="/addDeck">
            <AddCircleOutlineIcon />
          </Link>
          <Link to="/quiz">
            <QuizIcon />
          </Link>
          <Link to="/report">
            <LeaderboardIcon />
          </Link>
          <Avatar
            onClick={handleOpenMenu}
            src={profilePicUrl}
            className="profile-pic"
          />
        </div>
      </Slide>
    </div>
  );

  return (
    <div>
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <Dialog open={openDialog === "pic"} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Please upload your profile pics </DialogTitle>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button variant="contained" onClick={handleUploadPhoto}>
          Upload
        </Button>
      </Dialog>
      <Dialog open={openDialog === "name"} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Please enter your new user name</DialogTitle>
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={handleChangeName}>
          Confirm
        </Button>
      </Dialog>
      <Menu
        anchorEl={anchorEl}
        id="profile-pic"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setOpenDialog("name")}>
          Change User Name
        </MenuItem>
        <MenuItem onClick={() => setOpenDialog("pic")}>
          Add/Change Photo
        </MenuItem>
        <MenuItem onClick={handleSighOut}>Logout</MenuItem>
      </Menu>
      {windowWidth > 600 ? largeWindowDisplay : smallWindowDisplay}
    </div>
  );
}
