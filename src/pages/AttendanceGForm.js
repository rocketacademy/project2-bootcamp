import React, { useState } from "react";
import axios from "axios";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

export const AttendanceGForm = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    clientId: process.env.REACT_APP_CLIENT_ID,
    scope: "https://www.googleapis.com/auth/forms.responses.readonly",
    onSuccess: (codeResponse) => handleAuthSuccess(codeResponse),
    onError: (error) => handleAuthError(error),
    flow: "auth-code",
  });

  const handleLoginClick = () => {
    login();
  };

  const handleAuthSuccess = (codeResponse) => {
    console.log("codeResponse:", codeResponse);
    setLoading(true);

    axios
      .post("https://oauth2.googleapis.com/token", {
        code: codeResponse.code,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000",
        grant_type: "authorization_code",
      })
      .then((response) => {
        console.log("Token exchange response:", response.data);
        const newToken = response.data.access_token;
        setAccessToken((prevToken) => {
          console.log("Previous Token:", prevToken);
          console.log("New Token:", newToken);
          return newToken;
        });
        fetchData(newToken);
      })

      .catch((error) => {
        console.error("Token exchange error:", error);
        console.log("Error response:", error.response.data);
      });
  };

  const handleAuthError = (error) => {
    console.error("Login error:", error);
  };

  const fetchData = async (newToken) => {
    console.log("Access Token:", newToken);

    try {
      console.log("Request Headers:", {
        Authorization: `Bearer ${newToken}`,
      });
      const response = await axios.get(
        `https://forms.googleapis.com/v1/forms/1JpTggZyE7jJm_U9zqLaAlrN4Z5H-7tnXmyopDejMQ7E/responses`,
        { headers: { Authorization: `Bearer ${newToken}` } }
      );
      setResponses(response.data.responses);
    } catch (error) {
      console.error("Form data fetching error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  console.log(responses);

  const handleLogout = () => {
    googleLogout();
    setAccessToken(null);
    setResponses([]);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <button onClick={handleLoginClick}>Sign in with Google</button>
          {accessToken && <button onClick={handleLogout}>Logout</button>}
          {responses.length > 0 && (
            <table>{/* Display responses table here */}</table>
          )}
        </>
      )}
    </div>
  );
};
