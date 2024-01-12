import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import ErrorPage from "../../ErrorPage";
import DBhandler from "../Controller/DBhandler";

export default function QuizReportList() {
  const [user] = useOutletContext();
  const [quizList, setQuizList] = useState(null);
  const navi = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const dbHandler = useMemo(
    () => new DBhandler(user.uid, setErrorMessage),
    [user.uid, setErrorMessage]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/report");
  };

  //get the quiz report List
  useEffect(() => {
    const getQuizReportList = async () => {
      try {
        const newQuizList = await dbHandler.getUserQuizList();
        setQuizList(newQuizList);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getQuizReportList();
  }, [dbHandler]);

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
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: "id", sort: "asc" }] },
        }}
        pageSizeOptions={[10]}
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

  return (
    <div>
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      {display}
    </div>
  );
}
