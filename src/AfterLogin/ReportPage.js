import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { database } from "../firebase";
import { get, ref } from "firebase/database";
import Divider from "@mui/material/Divider";
import "./ReportPage.css";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import ErrorPage from "../ErrorPage";
//Take the user data from App.js state

export default function ReportPage() {
  const [user] = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [userWords, setUserWords] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getUserAndDeckInfo = async () => {
      const userInfoRef = ref(database, `userInfo/${user.uid}`);
      try {
        const newUserInfo = await get(userInfoRef);
        setUserInfo(newUserInfo.val());
        const decks = newUserInfo.val().decks;

        //get promise for deck
        const decksPromise = decks
          ? decks.map((deck) => {
              const getDeckInfo = async () => {
                const deckRef = ref(database, `decks/deck${deck}`);
                const deckInfo = await get(deckRef);
                return deckInfo.val().deckCards;
              };
              return getDeckInfo();
            })
          : [];

        //get all cards number from each deck
        const promises = Promise.all(decksPromise);
        const cardIDsInDecks = await promises;
        const words = new Set();
        for (const deck of cardIDsInDecks) {
          for (const cardID of deck) {
            words.add(cardID);
          }
        }
        setUserWords(words.size);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getUserAndDeckInfo();
  }, [user.uid]);

  //Data of each average score after each quiz
  let accumulateScore = 0;
  const chartData =
    userInfo && userInfo.quizReport
      ? Object.values(userInfo.quizReport).map(({ score, quizID }) => {
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
                <Link to="/quizList">
                  <Button>View Quiz History Reports</Button>
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
        handleErrorMessage={() => setErrorMessage("")}
      />
      {display}
    </div>
  );
}
