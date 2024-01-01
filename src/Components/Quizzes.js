import { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AppLinks } from "../AppMain";

// MUI
import { Button, Grid, Typography, Box } from "@mui/material";

export default function Quiz({ user }) {
  const quizData = [
    {
      question: "Where is the Merlion located?",
      options: ["Clarke Quay", "Marina Bay", "Ang Mo Kio"],
      image:
        "https://www.straitstimes.com/multimedia/graphics/2021/08/singapore-merlion-real-anatomy/assets/images/intro-proposed/1.jpg?v=62dce0b6",
      correctAnswer: "Clarke Quay",
    },
    {
      question: "When was the Merlion built?",
      options: [1972, 1968, 1980, 1955],
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Singapore_-_Merlion_0003.jpg/285px-Singapore_-_Merlion_0003.jpg",
      correctAnswer: 1972,
    },
    {
      question: "Where is the Infinity Pool located",
      options: ["Marina Bay", "Clarke Quay", "Bishan"],
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/SkyPark_Infinity_Pool_%28view_from_deckchair%29.jpg/1200px-SkyPark_Infinity_Pool_%28view_from_deckchair%29.jpg",
      correctAnswer: "Marina Bay",
    },
    {
      question: "dummy question",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const userId = user.uid;

  const usersCollectionRef = collection(db, "users", userId, "scores");

  const handleAnswerClick = async (selectedAnswer) => {
    setUserAnswer(selectedAnswer);

    const moveToNextQuestion = () => {
      return setTimeout(() => {
        if (currentQuestion + 1 < quizData.length) {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer(null);
        } else {
          console.log("Quiz ended:", score);
        }
      }, 2000);
    };

    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);

      try {
        const docRef = await addDoc(collection(db, "users", userId, "scores"), {
          quizName: "Quiz 1",
          score: score + 1,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (err) {
        console.error("Error adding document: ", err);
      }

      moveToNextQuestion();
    } else {
      try {
        const docRef = await addDoc(collection(db, "users", userId, "scores"), {
          quizName: "Quiz 1",
          score: score,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (err) {
        console.error("Error adding document: ", err);
      }
      moveToNextQuestion();
    }
  };

  const deleteUsersCollection = async () => {
    try {
      const querySnapshot = await getDocs(usersCollectionRef);
      console.log(querySnapshot);

      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
        console.log(`Document ${doc.id} successfully deleted`);
      });
    } catch (err) {
      console.error(`Error deleting documents: ${err}`);
    }
  };

  const querySnapshot = async () => {
    await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  };

  const resetButton = () => {
    setCurrentQuestion(0);
    setUserAnswer(null);
    setScore(0);
    console.log(currentQuestion, quizData.length);
  };

  console.log(currentQuestion, quizData.length);
  console.log(user);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <AppLinks />
      </Box>
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
              <Box>
                <img
                  src={`${quizData[currentQuestion].image}`}
                  alt="Pic of Landmark"
                  style={{ width: "300px", height: "300px" }}
                />
              </Box>
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
              <Button
                variant="contained"
                onClick={() => deleteUsersCollection()}
              >
                Delete score
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
}
