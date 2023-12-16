import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state

export default function ReportPage() {
  const [user, setUser] = useOutletContext();
  return <div>ReportPage</div>;
}
