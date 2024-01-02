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

  //get the quiz report List
  useEffect(() => {
    const getQuizReportList = async () => {
      const newQuizListRef = ref(database, `userInfo/${TESTINGID}/quizReport`);
      const newQuizList = await get(newQuizListRef);
      setQuizList(newQuizList.val());
    };
    getQuizReportList();
  }, []);

  //data for the DataGrid header use in display
  const columnData = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "score", headerName: "Score", width: 110 },
    { field: "date", headerName: "Date", width: 100 },
  ];

  //data for the DataGrid
  const listData =
    quizList &&
    Object.keys(quizList).map((quizKey) => {
      return {
        id: quizList[quizKey].quizID,
        score: quizList[quizKey].score,
        date: quizList[quizKey].date,
      };
    });

  //when getting data, show a backdrop
  //otherwise, show dataGrid
  const display = quizList ? (
    <div>
      <DataGrid
        rows={listData}
        columns={columnData}
        onRowClick={(e) => navi(`${e.id}`)}
        className="quiz-list"
      />
      <h6>Click on the row to view detailed report</h6>
      <Button onClick={() => navi("/report")}>Back</Button>
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
