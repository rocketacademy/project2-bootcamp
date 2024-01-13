import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Firebase
import { database } from "../../firebase.js";
import { storage } from "../../firebase.js";
import { update, push, ref, set } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadPicutreModal = (props) => {
  const [profileImgFile, setProfileImgFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const setImage = (imgUrl) => {
    update(ref(database, props.user), { profileImgUrl: imgUrl }).then(() => {
      props.close();
      setShowSuccessModal(true);
    });
  };

  const uploadImage = () => {
    const profileImgRef = sRef(storage, `${props.user}/profileImage`);
    uploadBytes(profileImgRef, profileImgFile).then(() => {
      const url = getDownloadURL(profileImgRef, "profileImage");
      url.then((value) => {
        setImage(value);
      });
    });
  };

  return (
    <div>
      <Modal show={props.show} onHide={props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Choose yourr new profile photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            onChange={(e) => setProfileImgFile(e.target.files[0])}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close}>
            Close
          </Button>
          <Button variant="primary" onClick={uploadImage}>
            Set
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choose yourr new profile photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Profile image successfully updated</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadPicutreModal;
