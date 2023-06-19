import "../App.css";
import InputExpenses from "./InputExpenses";
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

// get(child(dbRef, `${DB_EXPENSES_FOLDER_NAME}/${uid}`))
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       snapshot.forEach((childSnapshot) => {
//         const userKey = childSnapshot.key; // Retrieve the key of each child node
//         const userData = childSnapshot.val(); // Retrieve the data of each child node
//         console.log("User Key:", userKey);
//         console.log("User Data:", userData);
//         const requiredUserData = {
//           ["Display Name"]: userData.displayName,
//           ["First Name"]: userData.firstName,
//           ["Last Name"]: userData.lastName,
//           ["Email"]: userData.email,
//         };
//         setUserData(requiredUserData); //only take those required
//         setUserKey(userKey);

//         // use uid to find profile url
//         const profilePhotoRef = ref(
//           realTimeDatabase,
//           `${DB_USER_FOLDER_NAME}/${uid}/${userKey}/profileUrl`
//         );

//         onValue(profilePhotoRef, (snapshot) => {
//           setProfilePhotoURL(snapshot.val());
//         });
//       });
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });
