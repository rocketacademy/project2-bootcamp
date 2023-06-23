// File to contain 'Profile' items like edit and update name, profile picture, email address, bio, etc
import "../App.css";
import patchQuestionFillSvg from "../Icons/patch-question-fill.svg";
import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function Profile({
  userData,
  profilePhotoURL,
  fileInputFile,
  setFileInputFile,
  fileInputValue,
  setFileInputValue,
}) {
  const userInfo = Object.entries(userData).map(([key, value]) => (
    <div key={key}>
      <span>{key}: </span>
      <span>{value}</span>
    </div>
  ));

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUpload = () => {
    if (fileInputFile) {
      // Store images in an images folder in Firebase Storage
      const fileRef = storageRef(
        storage,
        ` ${STORAGE_PROFILE_FOLDER_NAME}/${userCredential.user.uid}/${fileInputFile.name}`
      );

      uploadBytes(fileRef, fileInputFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((profileUrl) => {
          // update user db with profile photo url
          const currUserRef = ref(
            realTimeDatabase,
            `${DB_USER_FOLDER_NAME}/${userCredential.user.uid}/profileUrl`
          );
          set(currUserRef, profileUrl);
        });
      });
    } else {
      const currUserRef = ref(
        realTimeDatabase,
        `${DB_USER_FOLDER_NAME}/${userCredential.user.uid}/profileUrl`
      );
      set(currUserRef, null);
    }
  };

  return (
    <div>
      {" "}
      <div className="temporary-box">
        <div>
          {profilePhotoURL ? (
            <img src={profilePhotoURL} alt="user" className="profile-picture" />
          ) : (
            <>
              <img
                src={patchQuestionFillSvg}
                alt="user"
                className="profile-picture"
              />
              <br /> <br />
            </>
          )}

          <Button onClick={handleShow}>Update profile picture</Button>
          <br />
          <br />
          <h1>{userData.displayName}</h1>
          {userInfo}
        </div>
      </div>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Profile Picture</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                type="file"
                value={fileInputValue}
                onChange={(e) => {
                  setFileInputFile(e.target.files[0]);
                  setFileInputValue(e.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpload}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
