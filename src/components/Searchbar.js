// import { Link } from "react-router-dom";
// import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
const Searchbar = () => {
  return (
    <div className="container-fluid ">
      <InputGroup className="mb-3 w-25 mx-auto">
        <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
        <Form.Control
          placeholder="Search for stock prices"
          aria-label="stock prices"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
    </div>
  );
};

export default Searchbar;
