import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logo from "../assets/logo.png";
import { Navbar as BootstrapNavbar } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Toggle from "react-toggle";
import { useState } from "react";
import { useTheme } from "./ThemeContext";
import "./Navbar.css";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  console.log(darkMode);
  const location = useLocation();
  const { pathname } = location;
  return (
    <BootstrapNavbar expand="lg" fixed="top" className="bg-body-tertiary">
      <Container className="m-0">
        <div className="logo">
          <Col xs={6} md={4}>
            <Image src={logo} roundedCircle fluid width={150} height={150} />
          </Col>
          {/* <img src={logo} alt="" className="w-25 h25" /> */}
        </div>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid">
            <Link className="nav-link" to="/">
              Home
            </Link>{" "}
            <Link className="nav-link" to="/dash">
              Dashboard
            </Link>
            <Link className="nav-link" to="/history">
              History
            </Link>
            <Link className="nav-link" to="/insights">
              Insights
            </Link>
            <Link className="nav-link" to="/history">
              Settings
            </Link>
          </Nav>
          {pathname.includes("/dash") && (
            <button className="border-0 bg-primary" onClick={toggleDarkMode}>
              {darkMode ? "🔆" : "🌙"}
            </button>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

// dashboard page
// style all the components
// connect to back end/fetch data
// more css
// link the login details to the dashboard
// link watchlist to the dasdhboard
// link history page to the dashboard
// send the toggle library link
