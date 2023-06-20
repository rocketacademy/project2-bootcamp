import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

export default function DisplayCurrency({ displayCurrency }) {
  return (
    <div>
      <Button>{displayCurrency}</Button>
    </div>
  );
}
