import React from "react";
import { Box, Typography, Button, Icon } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";

////////////////////////////////
//Component: ErrorPage - Display error notification if admin not identified
////////////////////////////////
const ErrorPage = () => {
  const errorCode = "401";
  const errorMessage = "Unauthorised User!";
  const navigate = useNavigate();
  const onBackButtonClick = () => {
    // Perform any necessary actions before navigation
    // ...
    // Navigate back to the previous page
    navigate(-1);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Icon sx={{ fontSize: "88px" }}>
        <ErrorIcon fontSize="inherit" color="warning" />
      </Icon>

      <Typography variant="h4" gutterBottom>
        Error {errorCode}
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        {errorMessage}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBack />}
        onClick={onBackButtonClick}
        sx={{ margin: "16px auto" }}
      >
        Back
      </Button>
    </Box>
  );
};

export default ErrorPage;
