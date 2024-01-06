import React, { useState } from "react";
import axios from "axios";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { TextboxWithLabels } from "../components/Textbox";

const QuizData = ({ sheetName }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [responses, setResponses] = useState([]);

  const spreadsheetId = "16HTIiiOq82Tm1tLHRQcr_8YJnO81QxZOOBOfR4hU3zc"; // Replace with your Sheet ID

  const login = useGoogleLogin({
    clientId: process.env.REACT_APP_CLIENT_ID,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    onSuccess: (codeResponse) => handleAuthSuccess(codeResponse),
    onError: (error) => handleAuthError(error),
    flow: "auth-code",
  });

  const handleLoginClick = () => {
    login();
  };

  const handleAuthSuccess = (codeResponse) => {
    console.log("codeResponse:", codeResponse);

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
        fetchSheetData(newToken);
      })

      .catch((error) => {
        console.error("Token exchange error:", error);
        console.log("Error response:", error.response.data);
      });
  };

  const handleAuthError = (error) => {
    console.error("Login error:", error);
  };

  const fetchSheetData = async (newToken) => {
    console.log("Access Token:", newToken);

    try {
      console.log("Request Headers:", {
        Authorization: `Bearer ${newToken}`,
      });
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}`,
        { headers: { Authorization: `Bearer ${newToken}` } }
      );
      setResponses(response.data.values);
    } catch (error) {
      console.error("Sheet data fetching error:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setAccessToken(null);
    setResponses([]);
  };

  console.log(responses);

  return (
    <div className="prose">
      {!accessToken && (
        <button className="btn" onClick={handleLoginClick}>
          Sign in with Google
        </button>
      )}
      {accessToken && (
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      )}
      {responses.length > 0 && (
        <>
          <h1>{sheetName}</h1>
          <button className="btn" onClick={() => fetchSheetData(accessToken)}>
            Refresh sheet data
          </button>
          <table className="table">
            <thead>
              <tr>
                {/* Only include the first three columns */}
                {responses[0].slice(0, 3).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Only include the first three cells of each row */}
                  {row.slice(0, 3).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export const Attendance = () => {
  const [sheetName, setSheetName] = useState("");

  const handleSheetName = (e) => {
    setSheetName(e.target.value);
  };

  return (
    <>
      <TextboxWithLabels
        label={"Sheet Name"}
        value={sheetName}
        onChange={handleSheetName}
      />
      <QuizData sheetName={sheetName} />
    </>
  );
};
