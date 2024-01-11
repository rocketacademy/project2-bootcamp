import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { quantum } from 'ldrs'

quantum.register()





const FetchingDataAnimation = () => {
  const text = 'Fetching data from OpenAI';
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    const textArray = text.split('');
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex <= textArray.length) {
        setVisibleText(textArray.slice(0, currentIndex).join(''));
        currentIndex += 1;
      } else {
        // If the end of the text is reached, reset the index
        currentIndex = 0;
        setVisibleText('');
      }
    }, 100); // Adjust the interval for the animation speed

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <Box
      className='overlay'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
      <Box>
        <span style={{ fontSize: '2em', fontWeight: 'bold' }}>{visibleText}</span>
      </Box>
      
      <l-quantum
      size="45"
      speed="1.75" 
      color="black" 
      ></l-quantum>
    </Box>
  );
};

export default FetchingDataAnimation;
