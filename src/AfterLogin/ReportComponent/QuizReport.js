import { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { get, ref } from "firebase/database";
import {
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function QuizReport() {
  const [user] = useOutletContext();
  const { quizNo } = useParams();
  const [quizInfo, setQuizInfo] = useState(null);
  const navi = useNavigate();

  //get particular quiz report from the user's quiz report
  useEffect(() => {
    const getQuizInfo = async () => {
      const quizRef = ref(
        database,
        `userInfo/${user.uid}/quizReport/quiz${quizNo}`
      );
      const quizReport = await get(quizRef);
      setQuizInfo(quizReport.val());
    };
    getQuizInfo();
  }, [quizNo, user.uid]);

  //generate quiz detail formmatted to use in the table
  const quizDetail = !quizInfo
    ? null
    : quizInfo.answer.map(({ deckName, english, spanish }, i) => {
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

  return quizInfo ? (
    <div className="page">
      <Button variant="outlined" onClick={() => navi("/quizList")}>
        Back to Quiz report Page
      </Button>
      <div className="quiz-report-header">
        <h2>Quiz {quizNo}</h2>
        <h5>Score:{quizInfo.score}</h5>
      </div>
      <div>{quizDetailTable}</div>
      <div>Date:{quizInfo.date}</div>
    </div>
  ) : null;
}
