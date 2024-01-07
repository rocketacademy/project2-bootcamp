import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const SettingsSuccessModal = (props) => {
  const typeDisplay = {
    displayName: "display name",
    email: "email",
  };

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          successfully changed {typeDisplay[props.field]}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>you can continue browsing</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsSuccessModal;
