import "../App.css";
import InputExpenses from "./InputExpenses";

export default function ListExpenses({ uid }) {
  return (
    <div className="list-container">
      <InputExpenses uid={uid} />
      List Component
    </div>
  );
}
