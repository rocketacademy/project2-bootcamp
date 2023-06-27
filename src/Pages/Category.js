import { useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";
import { ref, get, update } from "firebase/database";
import { Card, Button, Modal, Row, Col, Form } from "react-bootstrap";
import { SketchPicker } from "react-color";
import EmojiPicker from "emoji-picker-react";
const DB_USER_FOLDER_NAME = "user";
export default function Category({ uid, isLoggedIn }) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#000000");
  const [chosenEmoji, setChosenEmoji] = useState({ emoji: "🙂" });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);

  // useEffect to trigger getting and updating of userData with each update click
  useEffect(() => {
    const userDataRef = ref(realTimeDatabase, `${DB_USER_FOLDER_NAME}/${uid}`);
    get(userDataRef)
      .then((snapshot) => {
        const userData = snapshot.val();
        const categoriesData = Object.values(userData.categoriesData || {});
        setCategoriesData(categoriesData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [uid]);

  // function to allow user to add new category
  const handleSubmit = () => {
    // Create a new category object
    const newCategory = {
      category: category,
      color: color,
      emoji: chosenEmoji.emoji,
    };
    // Add the new category to the existing categories data array
    const updatedCategoriesData = [...categoriesData, newCategory];

    // Update the state with the updated categories data array
    setCategoriesData(updatedCategoriesData);
    console.log(categoriesData);

    // update user's profile with the new category
    const userRef = ref(realTimeDatabase, `${DB_USER_FOLDER_NAME}/${uid}`);
    update(userRef, {
      categoriesData: categoriesData,
    });

    // hide the modal after submission
    handleCloseCatModal();
  };

  // functions to show / hide inputExpenses modal
  const handleCloseCatModal = () => setShowCatModal(false);
  const handleShowCatModal = () => {
    setShowCatModal(true);
  };

  // function to set the chosen emoji
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setDisplayEmojiPicker(false); // Hide picker after selection
  };
  return (
    <div className="category">
      <h1>Categories</h1>
      <div>
        <h6>✏️ Click on the categories to edit</h6>
      </div>
      <Button
        variant="info"
        style={{
          width: "18rem",
          height: "5rem",
        }}
        onClick={() => handleShowCatModal()}
        title="Click to add new category"
      >
        + Add Category
      </Button>
      {categoriesData.map((category, index) => (
        <Card
          key={index}
          style={{
            width: "18rem",
          }}
          className="category-card"
        >
          <Card.Body>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  width: "3rem",
                  height: "3rem",
                  fontSize: "2rem",
                  backgroundColor: category.color,
                }}
              >
                {category.emoji}
              </span>
              <span style={{ marginLeft: "2rem" }}>{category.category}</span>
            </div>
          </Card.Body>
        </Card>
      ))}
      {/* Modal to key in new category  */}
      <Modal show={showCatModal} onHide={handleCloseCatModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Row>
              <Col>
                <Form.Label>Emoji</Form.Label>
                <br />
                <div
                  style={{
                    display: "inline-block",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    border: "1px solid black",
                    cursor: "pointer",
                    fontSize: "18px",
                    lineHeight: "36px",
                    textAlign: "center",
                  }}
                  onClick={() => setDisplayEmojiPicker(!displayEmojiPicker)}
                >
                  {chosenEmoji.emoji}
                </div>
                {/* ternary operator to show emoji picker */}
                {displayEmojiPicker ? (
                  <div style={{ position: "absolute" }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                ) : null}
              </Col>
              <Col>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Color</Form.Label>
                <div
                  style={{
                    backgroundColor: color,
                    width: "36px",
                    height: "36px",
                    border: "1px solid black",
                    cursor: "pointer",
                  }}
                  onClick={() => setDisplayColorPicker(!displayColorPicker)}
                />
                {/* ternary operator to display color picker */}
                {displayColorPicker ? (
                  <div style={{ position: "absolute", zIndex: "2" }}>
                    <div
                      style={{
                        position: "fixed",
                        top: "0px",
                        right: "0px",
                        bottom: "0px",
                        left: "0px",
                      }}
                      onClick={() => setDisplayColorPicker(false)}
                    />
                    <SketchPicker
                      color={color}
                      onChangeComplete={(color) => setColor(color.hex)}
                    />
                  </div>
                ) : null}
              </Col>
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCatModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
