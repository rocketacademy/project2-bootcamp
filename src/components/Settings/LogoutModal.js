import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { Link } from "react-router-dom";

import { auth } from "../../firebase.js";
import { signOut } from "firebase/auth";

const LogoutModal = (props) => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const logoutHandler = () => {
    signOut(auth);
    props.close();
    setShowConfirmLogout(true);
  };

  return (
    <div>
      <Modal show={props.show} onHide={props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close}>
            No
          </Button>
          <Button variant="primary" onClick={logoutHandler}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showConfirmLogout}
        onHide={() => setShowConfirmLogout(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have been logged out.</Modal.Body>
        <Modal.Footer>
          <Link className="btn btn-primary" to="/">
            Close
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LogoutModal;
