import { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  
} from "firebase/firestore";
import { db } from "../firebase";
import { AppLinks } from "../AppMain";
import OpenAI from "openai";

// MUI
import { Button, Grid, Typography, Box } from "@mui/material";

const parseOpenAIResponse = (responseString) => {
  const lines = responseString.split('\n')

  const question = lines[0]

  const answer = lines[lines.length -1].split(': ')[1]

  console.log(answer)

  const arrayOfOptions = lines.slice(1, -1).filter(line=> line.trim() !== '')

  const extractedData = arrayOfOptions.map(option=>{
    const letter = option.split(') ')[0]
    const choice = option.split(') ')[1]

    return {letter, choice}

  }) // Extracted Data is an array of objects with letter and choice as keys 

  

  return {question, extractedData, answer}
  
}

export default function QuizAI({ user }) {

  // state for openai's response
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState([])
  const [indexOfQuestion, setIndexOfQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)

  // const quizData = [
  //   'Marina Bay Sands',
  //   'Singapore Flyer',
  //   'Singapore Chinatown'
  // ]

  const quizData = [
    {
      question: 'Marina Bay Sands',
      index: 0
    },
    {
      question: 'Singapore Flyer',
      index: 1
    },
    {
      question: 'Chinatown Singapore',
      index: 2
    },
    {
      question: 'dummy question',
      index: 3
    }
  ]


  const getQuizFromOpenAI = async (argument) =>{
    const landmark = argument.question
    try {
      const prompt = `Generate a multiple choice question about ${landmark} where the options are labelled in capital letters, A), B), C), D). Don't leave any empty lines between the question and options. Put just the answer letter at the bottom as Answer: answer letter`

      const response = await fetch("http://localhost:3002/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json()
      console.log(data.message)

      const {question, extractedData, answer} = parseOpenAIResponse(data.message)

      console.log(question)
      console.log(extractedData)

      setQuestion(question)
      setOptions(extractedData)
      setAnswer(answer)

      setIndexOfQuestion(argument.index)

    } catch(err){
      console.error(`Error sending message due to: ${err}`)
    }
  }

  const handleAnswerClick = async (selectedAnswer)=>{
    if(selectedAnswer === answer){
      setScore(score + 1)
    }
  }

  const moveToNextQuestion = ()=>{
    setQuestion('')
    setOptions([])

    getQuizFromOpenAI(quizData[indexOfQuestion + 1])
  }

  const resetQuiz = ()=>{
    setQuestion('')
    setOptions([])
    setIndexOfQuestion(0)
    setAnswer('')
    setScore(0)
  }

  console.log(indexOfQuestion)

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <AppLinks />
      </Box>
      <Button onClick={()=> getQuizFromOpenAI(quizData[0])}>Start Quiz!</Button>
      <Box sx={{ display: "flex", flexDirection: 'column' ,justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Box>
          <Typography variant="h4" sx={{width: '900px', marginBottom: '20px'}}>Question: {question}</Typography>
        </Box>
        <Box>
          {options ? options.map((option, index)=>{
            const {letter, choice} = option
            
            return (
              <Box key={index} sx={{marginBottom: '20px'}}>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item>
                    <Typography variant="h4">{letter}</Typography>
                  </Grid>
                  <Grid item>
                    <Button onClick={()=> handleAnswerClick(letter)}>{choice}</Button>
                  </Grid>
                </Grid>
              </Box>
            )
          }) : null}
          {indexOfQuestion < quizData.length -2  ? <Button onClick={moveToNextQuestion}>Move to next Question</Button> : <Button onClick={resetQuiz}>Reset</Button>}
          <Typography variant="h5">Your score: {score}</Typography>
        </Box>
      </Box>    
    </Box>
  );
}
