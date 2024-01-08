import React, { useState } from "react";
import { TextboxWithLabels } from "../components/Textbox";
import axios from "axios";

const QuizData = ({ sheetName }) => {
  const [responses, setResponses] = useState([]);

  const spreadsheetId = "16HTIiiOq82Tm1tLHRQcr_8YJnO81QxZOOBOfR4hU3zc"; // Replace with your Sheet ID

  const fetchData = async () => {
    const publicSheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetName}`;
    console.log(publicSheetUrl);

    try {
      const response = await axios.get(publicSheetUrl);
      console.log(response);

      const csvData = response.data;
      console.log(csvData);

      const rows = csvData.split("\n");
      const parsedData = rows.map((row) => row.split(","));
      console.log(parsedData);
      setResponses(parsedData);
    } catch (error) {
      console.error("Error fetching sheet data:", error);
    }
  };

  return (
    <div className="pb-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
      <button className="btn sm:col-span-3" onClick={fetchData}>
        Refresh sheet data
      </button>
      <div className="sm:col-span-6">
        {responses.length > 0 && (
          <>
            <h1 className="text-center">{sheetName}</h1>
            <QuizTable responses={responses} />
          </>
        )}
      </div>
    </div>
  );
};

const QuizTable = ({ responses }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {responses[0]
            .filter((header) =>
              ["Timestamp", "Email Address", "Score"].includes(header)
            )
            .map((header, index) => (
              <th key={index}>{header}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {responses.slice(1).map((row, rowIndex) => {
          const [timestamp, emailAddress, score] = row;
          return (
            <tr key={rowIndex}>
              <td key={0}>{timestamp}</td>
              <td key={1}>{emailAddress}</td>
              <td key={2}>{score}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const AttendancePublic = () => {
  const [sheetName, setSheetName] = useState("");

  const handleSheetName = (e) => {
    setSheetName(e.target.value);
  };

  return (
    <>
      <div className="prose flex flex-col p-6">
        <h1 className="text-center">Attendance</h1>
        <div className="mb-5">
          <TextboxWithLabels
            label={"Sheet GID"}
            value={sheetName}
            onChange={handleSheetName}
          />
        </div>

        <QuizData sheetName={sheetName} />
      </div>
    </>
  );
};
