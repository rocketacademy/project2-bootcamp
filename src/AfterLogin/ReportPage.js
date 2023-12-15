import { useOutletContext } from "react-router-dom";

export default function ReportPage() {
  const [user, setUser] = useOutletContext();
  return <div>ReportPage</div>;
}
