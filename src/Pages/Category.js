import { useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";
import { ref, update, onValue, set, push } from "firebase/database";
import { Card, Button, Modal, Row, Col, Form } from "react-bootstrap";
import { SketchPicker } from "react-color";
import EmojiPicker from "emoji-picker-react";

const DB_CATEGORY_FOLDER_NAME = "categories";

export default function Category({ uid, isLoggedIn }) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#000000");
  const [chosenEmoji, setChosenEmoji] = useState({ emoji: "🙂" });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const userCatRef = ref(
      realTimeDatabase,
      `${DB_CATEGORY_FOLDER_NAME}/${uid}`
    );
    // Attach an asynchronous callback to read the data at our categories reference
    const unsubscribe = onValue(
      userCatRef,
      (snapshot) => {
        const catData = snapshot.val();
        console.log(catData);
        if (catData) {
          const catArray = Object.entries(catData).map(([key, value]) => ({
            id: key,
            ...value,
          }));

          setCategoriesData(catArray);
          console.log("catArray:", catArray);
        }
      },
      (errorObject) => {
        console.log("The read failed: " + errorObject.name);
      }
    );

    return () => {
      // Remove the listener when the component unmounts
      unsubscribe();
    };
  }, [uid]);

  // function to allow user to add new category
  const handleSubmit = (e) => {
    e.preventDefault();
    // update user's profile with the new category
    const catRef = ref(realTimeDatabase, `${DB_CATEGORY_FOLDER_NAME}/${uid}`);
    console.log("selectedCategoryId:", selectedCategoryId);
    if (selectedCategoryId) {
      // Updating an existing category
      const catUpdateRef = ref(
        realTimeDatabase,
        `${DB_CATEGORY_FOLDER_NAME}/${uid}/${selectedCategoryId}`
      );
      console.log("catUpdateRef:", catUpdateRef);
      update(catUpdateRef, {
        category: category,
        color: color,
        emoji: chosenEmoji.emoji,
      });
    } else {
      // Creating a new category
      const newCatRef = push(catRef);
      set(newCatRef, {
        category: category,
        color: color,
        emoji: chosenEmoji.emoji,
      });
    }
    // hide the modal after submission
    handleCloseCatModal();
  };

  // functions to show / hide inputExpenses modal
  const handleCloseCatModal = () => setShowCatModal(false);

  const handleShowCatModal = (category) => {
    if (category) {
      setSelectedCategoryId(category.id);
      setCategory(category.category);
      setColor(category.color);
      setChosenEmoji({ emoji: category.emoji });
    } else {
      setSelectedCategoryId(null);
      setCategory("");
      setColor("#000000");
      setChosenEmoji({ emoji: "🙂" });
    }

    console.log(selectedCategoryId);
    console.log(category);
    console.log(color);
    console.log(chosenEmoji);
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
      {/* loop through and show each category as a card */}
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
              <span
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                }}
                //emoji pencil to edit each category
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowCatModal(category);
                }}
              >
                ✏️
              </span>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Modal to key in new category and update category */}
      <Modal show={showCatModal} onHide={handleCloseCatModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCategoryId ? "Update Category" : "Add New Category"}
          </Modal.Title>
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
            {selectedCategoryId ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
