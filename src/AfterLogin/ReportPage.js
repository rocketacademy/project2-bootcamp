import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { database } from "../firebase";
import { get, ref } from "firebase/database";
import Divider from "@mui/material/Divider";
import "./ReportPage.css";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
//Take the user data from App.js state

export default function ReportPage() {
  const [user, setUser] = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [userWords, setUserWords] = useState(0);
  const TESTINGID = "DxXFVzvVUqSLfTtHfVUrjmV2MPW2";

  useEffect(() => {
    const getUserAndDeckInfo = async () => {
      const userInfoRef = ref(database, `userInfo/${TESTINGID}`);
      const newUserInfo = await get(userInfoRef);
      setUserInfo(newUserInfo.val());
      const decks = newUserInfo.val().decks;

      const decksPromise = decks.map((deck) => {
        const getDeckInfo = async () => {
          const deckRef = ref(database, `decks/deck${deck}`);
          const deckInfo = await get(deckRef);
          return deckInfo.val().deckCards.length;
        };
        return getDeckInfo();
      });
      const promises = Promise.all(decksPromise);
      const wordsOfDecks = await promises;
      const totalWords = wordsOfDecks.reduce((a, b) => a + b, 0);
      setUserWords(totalWords);
    };
    getUserAndDeckInfo();
  }, []);

  const scoreOfEachQuiz = userInfo
    ? Object.values(userInfo.quizReport).map(({ score }) => score)
    : [];
  const averageScore = Math.round(
    scoreOfEachQuiz.reduce((a, b) => a + b, 0) / scoreOfEachQuiz.length
  );

  let accumulateScore = 0;
  const chartData = userInfo
    ? Object.values(userInfo.quizReport).map(({ score, quizID }) => {
        accumulateScore += score;
        return { averageScore: accumulateScore / quizID, quiz: quizID };
      })
    : [];

  const display =
    userInfo === null ? (
      <Backdrop open={userInfo === null}>
        <h3>Getting User Infomation</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
    ) : (
      <div className="page">
        <div className="report-sub-page">
          <div className="info">
            Words in learning
            <Divider className="divider" />
            <h4>{userWords} words</h4>
          </div>
          <div className="info">
            Average Score
            <Divider className="divider" />
            <h4>{averageScore}/100 pts</h4>
          </div>
          <LineChart width={350} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="quiz"
              label={{ value: "Quiz", position: "insideBottom", offset: 0 }}
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
        </div>
      </div>
    );

  return display;
}
