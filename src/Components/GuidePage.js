import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const GuidePage = () => {
  return (
    <Container>
      <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          User Guide
        </Typography>

        <Box>
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography>
            Welcome to our app! Follow these steps to get started.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            How to Use Feature X
          </Typography>
          <Typography>
            Learn how to make the most out of Feature X in our app.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Troubleshooting Tips
          </Typography>
          <Typography>
            Encountering issues? Check these troubleshooting tips.
          </Typography>
        </Box>

        {/* Add more sections as needed */}
      </Paper>
    </Container>
  );
};

export default GuidePage;
