import { useState } from "react";

// MUI
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
} from "@mui/material";

export default function Quiz() {
  const quizData = [
    {
      question: "Where is the Merlion located?",
      options: ["Clarke Quay", "Marina Bay", "Ang Mo Kio"],
      correctAnswer: "Clarke Quay",
    },
    {
      question: "When was the Merlion built?",
      options: [1972, 1968, 1980, 1955],
      correctAnswer: 1972,
    },
    {
      question: "Where is the Infinity Pool located",
      options: ["Marina Bay", "Clarke Quay", "Bishan"],
      correctAnswer: "Marina Bay",
    },
    {
      question: "dummy question",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const handleAnswerClick = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);

    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);

      setTimeout(() => {
        if (currentQuestion + 1 < quizData.length) {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer(null);
        } else {
          console.log("Quiz ended:", score);
        }
      }, 2000);
    }
  };

  const resetButton = () => {
    setCurrentQuestion(0);
    setUserAnswer(null);
    setScore(0);
    console.log(currentQuestion, quizData.length);
  };

  console.log(currentQuestion, quizData.length);

  return (
    <Grid
      container
      sx={{ height: "100vh", display: "flex", justifyContent: "center" }}
    >
      <Box>
        {currentQuestion < quizData.length - 1 ? (
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Typography variant="h5">
              {quizData[currentQuestion].question}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {quizData[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onClick={() => handleAnswerClick(option)}
                  disabled={userAnswer !== null}
                  sx={{ mt: 1, width: "100%" }}
                >
                  {option}
                </Button>
              ))}
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5">Quiz Finished</Typography>
            <Typography variant="body1">Your final score: {score}</Typography>
            <Button variant="contained" onClick={(e) => resetButton()}>
              Reset
            </Button>
          </Box>
        )}
      </Box>
    </Grid>
  );
}
