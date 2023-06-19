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
          padding: "5px",
          gridRow: "auto",
          overflow: "scroll",
        }}
      >
        {expenses.map((item) => (
          <Card key={item.id}>
            <Card.Body>
              <Card.Title>{item.category}</Card.Title>
              <Card.Text>{item.amount}</Card.Text>
              <Card.Text>{item.description}</Card.Text>
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
