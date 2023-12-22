import { Backdrop, Button, CircularProgress } from "@mui/material";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { DataGrid } from "@mui/x-data-grid";

export default function QuizReportList() {
  const [user, setUser] = useOutletContext();
  const [quizList, setQuizList] = useState(null);
  const navi = useNavigate();
  const TESTINGID = "DxXFVzvVUqSLfTtHfVUrjmV2MPW2";

  useEffect(() => {
    const getQuizReportList = async () => {
      const newQuizListRef = ref(database, `userInfo/${TESTINGID}/quizReport`);
      const newQuizList = await get(newQuizListRef);
      setQuizList(newQuizList.val());
    };
    getQuizReportList();
  }, []);

  const columnData = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "score", headerName: "Score", width: 110 },
    { field: "date", headerName: "Date", width: 100 },
  ];

  const listData =
    quizList &&
    Object.values(quizList).map((quiz, i) => {
      return {
        id: quiz.quizID,
        score: quiz.score,
        date: quiz.date,
      };
    });

  const display = quizList ? (
    <div>
      <DataGrid
        rows={listData}
        columns={columnData}
        onRowClick={(e) => navi(`${e.id}`)}
        className="quiz-list"
      />
      <h6>Click on the row to view detailed report</h6>
    </div>
  ) : (
    <Backdrop open={true}>
      <h3>Getting Quiz History Reports</h3>
      <h1>
        <CircularProgress color="inherit" />
      </h1>
    </Backdrop>
  );

  return display;
}
