import { useEffect, useMemo, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import {
  Backdrop,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ErrorPage from "../../ErrorPage";
import DBHandler from "../../Controller/DBHandler";

export default function QuizReport() {
  const [user] = useOutletContext();
  const { quizNo } = useParams();
  const [quizInfo, setQuizInfo] = useState(null);
  const navi = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage),
    [user.uid, setErrorMessage]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/report");
  };

  //get particular quiz report from the user's quiz report
  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizReport = await dbHandler.getUserQuizReport(quizNo);
        setQuizInfo(quizReport);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, [quizNo, dbHandler]);

  //generate quiz detail formmatted to use in the table
  const quizDetail =
    quizInfo &&
    quizInfo.answer.map(({ english, spanish }, i) => {
      return (
        <TableRow key={english}>
          <TableCell>{english}</TableCell>
          <TableCell>{spanish}</TableCell>
          <TableCell
            className={spanish === quizInfo.choice[i] ? "correct" : "wrong"}
          >
            {quizInfo.choice[i]}
          </TableCell>
        </TableRow>
      );
    });

  const quizDetailTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <h3>English</h3>
            </TableCell>
            <TableCell>
              <h3>Answer</h3>
            </TableCell>
            <TableCell>
              <h3>Your Choice</h3>
            </TableCell>
          </TableRow>
          {quizDetail}
        </TableHead>
      </Table>
    </TableContainer>
  );

  const display = quizInfo ? (
    <div className="page">
      <Button variant="outlined" onClick={() => navi("/reportList")}>
        Back to Quiz report Page
      </Button>
      <div className="quiz-report-header">
        <h2>Quiz {quizNo}</h2>
        <h5>Score: {quizInfo.score}</h5>
      </div>
      <div>{quizDetailTable}</div>
      <div>Date: {quizInfo.date}</div>
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
