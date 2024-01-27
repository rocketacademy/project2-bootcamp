import React from "react";
// import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Accountsummary = () => {
  const data = { amountInvested: 1000, cash: 500, portoflioValue: 50000 };

  return (
    <Container className="mt-4">
      <Row className="gx-1">
        <Col>
          <div className="d-flex align-items-center p-3 bg-primary text-white">
            <span className="me-2 fw-bold">Amount Invested:</span>
            <span>{data.amountInvested}</span>
          </div>
        </Col>
        <Col>
          <div className="d-flex align-items-center p-3 bg-success text-white">
            <span className="me-2 fw-bold">Cash:</span>
            <span>{data.cash}</span>
          </div>
        </Col>
        <Col>
          <div className="d-flex align-items-center p-3 bg-danger text-white">
            <span className="me-2 fw-bold">Portfolio Value:</span>
            <span>{data.portoflioValue}</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Accountsummary;
