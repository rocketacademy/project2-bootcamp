import "../App.css";
import InputExpenses from "./InputExpenses";

export default function ListExpenses({
  uid,
  expenseCounter,
  setExpenseCounter,
  userLocation,
}) {
  return (
    <div className="list-container">
      <InputExpenses
        uid={uid}
        expenseCounter={expenseCounter}
        setExpenseCounter={setExpenseCounter}
        userLocation={userLocation}
      />
    </div>
  );
}
