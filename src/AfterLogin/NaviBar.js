import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function NaviBar() {
  const handleSighOut = () => {
    signOut(auth);
  };

  return (
    <div className="navi-bar">
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
        <LogoutIcon onClick={handleSighOut} />
      </div>
    </div>
  );
}
