import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./AfterLogin/HomePage";
import StudyPage from "./AfterLogin/StudyPage";
import BrowsePage from "./AfterLogin/BrowsePage";
import ReportPage from "./AfterLogin/ReportPage";
import QuizPage from "./AfterLogin/QuizPage";
import SignInPage from "./BeforeLogin/SignInPage";
import RegisterPage from "./BeforeLogin/RegisterPage";
import EditDeckPage from "./AfterLogin/EditDeckPage";
import QuizReportList from "./AfterLogin/ReportComponent/QuizReportList";
import QuizReport from "./AfterLogin/ReportComponent/QuizReport";
import SearchPage from "./AfterLogin/SearchPage";
import ResetPasswordPage from "./BeforeLogin/ResetPasswordPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="" element={<HomePage />} />
        <Route path="addDeck" element={<EditDeckPage />} />
        <Route path="editDeck" element={<EditDeckPage />} />
        <Route path="/editDeck/:deckID" element={<EditDeckPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="/study/:deckID" element={<StudyPage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="/browse/:deckID" element={<BrowsePage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="reportList" element={<QuizReportList />} />
        <Route path="reportList/:quizNo" element={<QuizReport />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="quiz/:mode/:deckID" element={<QuizPage />} />
        <Route path="*" element={<div>404</div>} />
        <Route path="search/:keyword" element={<SearchPage />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </BrowserRouter>
);
