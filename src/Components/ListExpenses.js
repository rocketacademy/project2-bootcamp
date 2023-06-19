import "../App.css";
import InputExpenses from "./InputExpenses";
import { Card } from "react-bootstrap";

export default function ListExpenses({
  uid,
  expenseCounter,
  setExpenseCounter,
  userLocation,
  expenses,
}) {
  return (
    <div className="list-container">
      <div
        style={{
          display: "grid",
          // padding: "5px",
          gridRow: "auto",
          overflow: "scroll",
          fontSize: "1.25rem",
          marginTop: "20px",
        }}
      >
        {expenses.map((item) => (
          <Card key={item.id}>
            <Card.Body>
              <Card.Subtitle>
                {item.category}: {item.amount}
              </Card.Subtitle>
              <Card.Subtitle>{item.description}</Card.Subtitle>
            </Card.Body>
          </Card>
        ))}
      </div>
      <InputExpenses
        uid={uid}
        expenseCounter={expenseCounter}
        setExpenseCounter={setExpenseCounter}
        userLocation={userLocation}
      />
    </div>
  );
}
