import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Link } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import { signOut } from "firebase/auth";
import { auth, database, storage } from "../firebase";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  Input,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ref as DBref, get, set } from "firebase/database";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function NaviBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [file, setFile] = useState("");

  useEffect(() => {
    const takePic = async () => {
      const userPicRef = DBref(
        database,
        `userInfo/${props.user.uid}/profilePic`
      );
      try {
        const urlDB = await get(userPicRef);
        setProfilePicUrl(urlDB.val());
      } catch (error) {
        console.log(error);
      }
    };

    if (props.user) {
      takePic();
    }
  }, [props.user]);

  const handleSighOut = () => {
    signOut(auth);
  };

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleUploadPhoto = async () => {
    const photoRef = ref(storage, `profilePics/${props.user.uid}.jpg`);
    try {
      await uploadBytes(photoRef, file);
      const url = await getDownloadURL(photoRef);
      const userRef = DBref(database, `userInfo/${props.user.uid}/profilePic`);
      await set(userRef, url);
      setProfilePicUrl(url);
      setFile("");
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="navi-bar">
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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

      <Menu
        anchorEl={anchorEl}
        id="profile-pic"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setOpenDialog(true)}>
          Add/Change Photo
        </MenuItem>
        <MenuItem onClick={handleSighOut}>Logout</MenuItem>
      </Menu>

      <h1>
        <Link to="/">App.</Link>
      </h1>
      <div className="navi-icon-div">
        <Link to="/report">
          <LeaderboardIcon />
        </Link>
        <Link to="/addDeck">
          <PostAddIcon />
        </Link>
        <Link to="/quiz">
          <QuizIcon />
        </Link>
        <Avatar onClick={handleOpenMenu} src={profilePicUrl} />
      </div>
    </div>
  );
}
