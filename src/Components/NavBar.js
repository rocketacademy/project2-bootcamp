import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

export default function NavBar({ isLoggedIn }) {
  return (
    <div className="nav-bar">
      <Navbar bg="light" fixed="top">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt="Money Stack Emoji"
              src="https://em-content.zobj.net/thumbs/240/apple/354/dollar-banknote_1f4b5.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Dollar Direction
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/welcome">
                Welcome
              </Nav.Link>
              <Nav.Link as={Link} to="/authForm">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/">
                Map/Expenses
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
