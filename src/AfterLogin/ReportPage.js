import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import "./ReportPage.css";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
//Take the user data from App.js state

export default function ReportPage() {
  const [user] = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [userWords, setUserWords] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [goHome, setGoHome] = useState(false);
  const navi = useNavigate();
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage, setGoHome),
    [user.uid, setErrorMessage, setGoHome]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    if (goHome) {
      navi("/");
    }
  };

  useEffect(() => {
    const getUserAndDeckInfo = async () => {
      try {
        const { userInfo, userDecks } = await dbHandler.getUserAndDecksInfo(
          true
        );
        const words = new Set();
        for (const deck of userDecks) {
          for (const cardID of deck.deckCards) {
            words.add(cardID);
          }
        }
        setUserInfo(userInfo);
        setUserWords(words.size);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getUserAndDeckInfo();
  }, [dbHandler]);

  //Data of each average score after each quiz
  let accumulateScore = 0;
  const chartData =
    userInfo && userInfo.quizReport
      ? Object.values(userInfo.quizReport)
          .sort((a, b) => a.quizID - b.quizID)
          .map(({ score, quizID }) => {
            accumulateScore += score;
            return { averageScore: accumulateScore / quizID, quiz: quizID };
          })
      : [];

  //Total average score same as the last index
  const averageScore =
    chartData.length &&
    Math.round(chartData[chartData.length - 1].averageScore);

  const chart = (
    <LineChart width={350} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="quiz"
        label={{
          value: "Quiz",
          position: "insideLeft",
          offset: -60,
        }}
      />
      <YAxis
        type="number"
        domain={[0, 100]}
        label={{
          value: "Average Score",
          angle: -90,
          position: "insideBottomLeft",
          offset: 12,
        }}
      />
      <Line type="monotone" dataKey="averageScore" />
    </LineChart>
  );
  //When Loading file from the databse, will show a backdrop
  const display =
    userInfo === null ? (
      <Backdrop open={true}>
        <h3>Getting User Infomation</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
    ) : (
      <div className="page">
        <h3 className="report-greeting">
          Hi, {user.displayName ? user.displayName : "student"}. Keep fighting!
        </h3>
        <div className="report-sub-page">
          <div className="info">
            Words in learning
            <Divider className="divider" />
            <h4>{userWords} words</h4>
          </div>
          <div className="info">
            Average Score
            <Divider className="divider" />
            {userInfo && userInfo.quizReport ? (
              <div className="info">
                <h4>{averageScore}/100 pts</h4>
                <br />
                <Link to="/reportList">
                  <Button className="quiz-history-reports">
                    View Quiz History Reports
                  </Button>
                </Link>
              </div>
            ) : (
              "You need to take quiz first"
            )}
          </div>
          {chart}
        </div>
      </div>
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
