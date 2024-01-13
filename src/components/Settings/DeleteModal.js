import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { Link } from "react-router-dom";

import { auth } from "../../firebase.js";
import { deleteUser } from "firebase/auth";
import { database } from "../../firebase.js";
import { ref, remove } from "firebase/database";

const DeleteModal = (props) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const confirmDeleteHandler = () => {
    setShowConfirmDelete(true);
    props.close();
  };

  const deleteHandler = () => {
    const deletedUser = auth.currentUser.uid;
    deleteUser(auth.currentUser).then(() => {
      remove(ref(database, deletedUser)).then(() => {
        setShowConfirmDelete(false);
        setShowDeleteSuccess(true);
      });
    });
  };

  return (
    <div>
      <Modal show={props.show} onHide={props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This is not reversable
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close}>
            No
          </Button>
          <Button variant="primary" onClick={confirmDeleteHandler}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Click "Yes" to delete your account</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDelete(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={deleteHandler}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showDeleteSuccess}
        onHide={() => setShowDeleteSuccess(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Account successfully deleted</Modal.Body>
        <Modal.Footer>
          <Link className="btn btn-primary" to="/">
            Close
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteModal;
