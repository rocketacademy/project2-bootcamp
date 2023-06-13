// File to contain 'Dashboard' items like charts, expense by category
import NavBar from "../Components/NavBar";
import "../App.css";

export default function Dashboard() {
  return (
    <div>
      {" "}
      <NavBar />
      <div className="temporary-box">Dashboard</div>
    </div>
  );
}
