import "../App.css";
import InputExpenses from "./InputExpenses";
// import { Card } from "react-bootstrap";

// export default function ListExpenses({
//   uid,
//   expenseCounter,
//   setExpenseCounter,
//   userLocation,
//   expenses,
// }) {
//   return (
//     <div className="list-container">
//       <div
//         style={{
//           display: "grid",
//           // padding: "5px",
//           gridRow: "auto",
//           overflow: "scroll",
//           fontSize: "1.25rem",
//           marginTop: "20px",
//         }}
//       >
//         {expenses.map((item) => (
//           <Card key={item.id}>
//             <Card.Body>
//               <Card.Subtitle>
//                 {item.category}: {item.amount}
//               </Card.Subtitle>
//               <Card.Subtitle>{item.description}</Card.Subtitle>
//             </Card.Body>
//           </Card>
//         ))}
//       </div>
//       <InputExpenses
//         uid={uid}
//         expenseCounter={expenseCounter}
//         setExpenseCounter={setExpenseCounter}
//         userLocation={userLocation}
//       />
import { realTimeDatabase } from "../firebase";
import { ref, onChildAdded, off } from "firebase/database";
import { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";

const DB_EXPENSES_FOLDER_NAME = "expenses";

export default function ListExpenses({ uid }) {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const expRef = ref(realTimeDatabase, `${DB_EXPENSES_FOLDER_NAME}/${uid}`);

    const eventCallback = (data) => {
      setExpenses((state) => [...state, { key: data.key, val: data.val() }]);
      console.log(data.key);
    };

    onChildAdded(expRef, eventCallback);
    // onChildAdded will return data for every child at the reference and every subsequent new child

    return () => {
      off(expRef, "child_added", eventCallback); // Unsubscribe from the event listener
    };
  }, [uid]);
  console.log(expenses);

  const handleButtonClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  const allExp = expenses.map((expense) => (
    <Card key={expense.key}>
      <Card.Header>{expense.val.date}</Card.Header>

      <Card.Body>
        <div className="card-content">
          <div>
            <Card.Title>
              {expense.val.category} - {expense.val.location}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {expense.val.description}
              <br />
              {expense.val.currency} {expense.val.amount}
            </Card.Subtitle>
            {/* <Card.Text></Card.Text> */}
          </div>

          <Button
            variant="info"
            onClick={() => handleButtonClick(expense)}
            title="Click to view receipt"
          >
            Show Receipt
          </Button>
        </div>
      </Card.Body>
    </Card>
  ));

  // Render the list of expenses
  return (
    <div>
      <div className="card-header">
        <InputExpenses uid={uid} />
      </div>
      {allExp}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Receipt Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExpense && (
            <img
              src={selectedExpense.val.receiptUrl}
              alt="Expense"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
