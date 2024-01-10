import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Firebase
import { auth } from "../firebase.js";
import { updateProfile, updateEmail } from "firebase/auth";

const SettingsModal = (props) => {
  const [infoField, setInfoField] = useState("");
  const handleChange = (e) => {
    setInfoField(e.target.value);
  };

  const closeHandler = () => {
    setInfoField("");
    props.close();
  };

  const updateUserProfile = () => {
    // make one for updateEmail
    if (props.field === "email" && props.emaolToggle === true) {
      updateEmail(auth.currentUser, infoField).then(() =>
        props.handleSuccessfulUpdate()
      );
    } else {
      updateProfile(auth.currentUser, { [props.field]: infoField }).then(() =>
        props.handleSuccessfulUpdate()
      );
    }
    setInfoField("");
    props.close();
    return true;
  };

  const typeDisplay = {
    displayName: "display name",
    email: "email",
  };

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Header closeButton>
        <Modal.Title>Enter new {typeDisplay[props.field]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={infoField}
          onChange={(e) => handleChange(e)}
        ></input>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={updateUserProfile}>
          Set
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
