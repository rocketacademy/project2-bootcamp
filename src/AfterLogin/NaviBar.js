import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  Input,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
import StorageHandler from "../Controller/StorageHandler";

export default function NaviBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
  return (
    <div className="navi-bar">
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

      <h1>
        <Link to="/">App.</Link>
      </h1>
      <div className="navi-icon-div">
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
}
