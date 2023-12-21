import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./AfterLogin/HomePage";
import StudyPage from "./AfterLogin/StudyPage";
import ReportPage from "./AfterLogin/ReportPage";
import QuizPage from "./AfterLogin/QuizPage";
import SignInPage from "./BeforeLogin/SignInPage";
import RegisterPage from "./BeforeLogin/RegisterPage";
import EditdeckPage from "./AfterLogin/EditDeckPage";
import AddDeckPage from "./AfterLogin/AddDeckPage";
import QuizReportList from "./AfterLogin/QuizReportList";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="" element={<HomePage />} />
        <Route path="addDeck" element={<AddDeckPage />} />
        <Route path="editDeck" element={<EditdeckPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="quizList/:quizNo" element={<QuizReportList />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="*" element={<div>404</div>} />
      </Route>
      <Route path="*" element={<div>404</div>} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </BrowserRouter>
);
