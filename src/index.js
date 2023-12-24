import React from "react";
import { createRoot } from "react-dom/client";
//import AppTestIan from "./AppTestIan";
import App from "./App";

const rootElement = document.getElementById("root");
createRoot(rootElement).render(<App />);
