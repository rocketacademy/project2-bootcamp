import { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AppLinks } from '../AppMain';
import OpenAI from 'openai';
import { Link } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// MUI
import {
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Paper,
  ListItem,
} from '@mui/material';

const parseOpenAIResponse = (responseString) => {
  const lines = responseString.split('\n');

  const question = lines[0];

  const answer = lines[lines.length - 1].split(': ')[1];

  console.log(answer);

  const arrayOfOptions = lines
    .slice(1, -1)
    .filter((line) => line.trim() !== '');

  const extractedData = arrayOfOptions.map((option) => {
    const letter = option.split(') ')[0];
    const choice = option.split(') ')[1];

    return { letter, choice };
  }); // Extracted Data is an array of objects with letter and choice as keys

  return { question, extractedData, answer };
};

export default function QuizAI({ user }) {
  // state for openai's response
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [indexOfQuestion, setIndexOfQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(0);
  const [selectedAnswerCorrectness, setSelectedAnswerCorrectness] =
    useState(null);
  const [answerSelected, setAnswerSelected] = useState(false);

  const [loading, setLoading] = useState(false);

  const quizData = [
    {
      question: "Marina Bay Sands",
      index: 0,
    },
    {
      question: "Singapore Flyer",
      index: 1,
    },
    {
      question: "Chinatown Singapore",
      index: 2,
    },
    {
      question: "dummy question",
      index: 3,
      counter: 0,
    },
  ];


  
  const getQuizFromOpenAI = async (argument) => {
    setLoading(true);

    if (answerSelected === true) {
      setAnswerSelected(false);
    if (answerSelected === true) {
      setAnswerSelected(false);
    }

    const landmark = argument.question;
   
    try {
      const prompt = `Generate a multiple choice question about ${landmark} where the options are labelled in capital letters, A), B), C), D). Don't leave any empty lines between the question and options. Put just the answer letter at the bottom as Answer: answer letter and don't put Question at the beginning`;

      const response = await fetch('http://localhost:3002/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      console.log(data.message);
    

      const { question, extractedData, answer } = parseOpenAIResponse(
        data.message,
      );

      console.log(question);
      console.log(extractedData);
      console.log(question);
      console.log(extractedData);

      setQuestion(question);
      setOptions(extractedData);
      setAnswer(answer);
      setQuestion(question);
      setOptions(extractedData);
      setAnswer(answer);

      setIndexOfQuestion(argument.index);
      setIndexOfQuestion(argument.index);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(`Error sending message due to: ${err}`);
      setLoading(false);
    } 
  };
  

  const handleAnswerClick = async (selectedAnswer) => {
    if (selectedAnswer === answer && counter === 0) {
  const handleAnswerClick = async (selectedAnswer) => {
    if (selectedAnswer === answer && counter === 0) {
      // Increase counter by 1 so that user cannot click the same answer more than twice to increase score
      setScore(score + 1);
      setCounter(counter + 1);
      setSelectedAnswerCorrectness(true);
      setScore(score + 1);
      setCounter(counter + 1);
      setSelectedAnswerCorrectness(true);
    } else {
      setSelectedAnswerCorrectness(false);
      setSelectedAnswerCorrectness(false);
    }
    setAnswerSelected(true);
  };
    setAnswerSelected(true);
  };

  const moveToNextQuestion = () => {
    setQuestion('');
    setOptions([]);
    setCounter(0);
    setSelectedAnswerCorrectness(null);
    setAnswerSelected(false);

    getQuizFromOpenAI(quizData[indexOfQuestion + 1]);
  };
    getQuizFromOpenAI(quizData[indexOfQuestion + 1]);
  };

  const resetQuiz = () => {
    setQuestion('');
    setOptions([]);
    setIndexOfQuestion(0);
    setAnswer('');
    setScore(0);
  };

  console.log(indexOfQuestion);
  console.log(indexOfQuestion);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className="link-container">
          <AppLinks />
        </Box>
        <Box className="drawer-links">
          <ListItem>
            <Link to="/">
              <ArrowBackIcon
                sx={{
                  marginRight: '300px',
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            </Link>
          </ListItem>
        </Box>
      </Box>
      <Button onClick={() => getQuizFromOpenAI(quizData[0])}>
        Start Quiz!
      </Button>
      <Button onClick={() => getQuizFromOpenAI(quizData[0])}>
        Start Quiz!
      </Button>

      {question ? (
        <Typography
          variant="h4"
          sx={{
            width: '900px',
            marginBottom: '20px',
            marginTop: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Question: {question}
        </Typography>
      ) : null}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <Box>
            {options ? (
              <Grid container spacing={2} justifyContent="center">
                {/* Wrap options in a separate Grid container */}
                <Grid
                  container
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  spacing={2}
                  justifyContent="center"
                >
                  {options.map((option, index) => {
                    const { letter, choice } = option;
                    const isCorrect =
                      answer === letter && selectedAnswerCorrectness === true;
                    const isWrong =
                      answer !== letter && selectedAnswerCorrectness === false;
                    return (
                      <Grid item key={index} xs={6}>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: '10px',
                            textAlign: 'center',
                            width: '250px',
                            height: '100px',
                          }}
                        >
                          <Grid item xs={3}>
                            <Typography
                              variant="h4"
                              sx={{
                                color: isCorrect
                                  ? 'green'
                                  : isWrong
                                  ? 'red'
                                  : 'inherit',
                              }}
                            >
                              {letter}
                            </Typography>
                          </Grid>
                          <Grid item xs={9}>
                            <Button
                              onClick={() => handleAnswerClick(letter)}
                              disabled={answerSelected}
                              fullWidth
                            >
                              {choice}
                            </Button>
                          </Grid>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            ) : null}
          </Box>
        </Box>
      )}
      {question && indexOfQuestion < quizData.length - 2 ? (
        <Button onClick={moveToNextQuestion}>Move to next question</Button>
      ) : null}
      {indexOfQuestion >= quizData.length - 2 ? (
        <Button onClick={resetQuiz}>Reset</Button>
      ) : null}
      <Typography variant="h5">Your score: {score}</Typography>
    </Box>
  );
}
