import React, { useState, useEffect } from "react";
import axios from "axios";
import { ref, onChildAdded } from "firebase/database";
import { db } from "../firebase";

const QuizData = ({ gid, courseName }) => {
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const spreadsheetId = "16HTIiiOq82Tm1tLHRQcr_8YJnO81QxZOOBOfR4hU3zc"; // Replace with your Sheet ID

  const fetchData = async () => {
    setIsLoading(true);
    const publicSheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [gid]);

  return (
    <div className="mt-8 pb-8 grid grid-cols-1 justify-items-center sm:grid-cols-6">
      {isLoading ? (
        <span className="loading loading-dots loading-lg  sm:col-span-6"></span>
      ) : (
        responses.length > 0 && (
          <>
            <h1 className="text-center sm:col-span-6">{courseName}</h1>
            <button
              className="mb-6 btn btn-ghost sm:col-start-3 col-span-2 "
              onClick={fetchData}
            >
              REFRESH
            </button>
            <QuizTable responses={responses} />
          </>
        )
      )}
    </div>
  );
};

const QuizTable = ({ responses }) => {
  return (
    <table className="table sm:col-span-6">
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
  const DB_COURSE_KEY = "courses";
  const coursesRef = ref(db, DB_COURSE_KEY);
  const [courseGidMap, setCourseGidMap] = useState(new Map());
  const [courseName, setCourseName] = useState("Select Course");
  const [gid, setGid] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    onChildAdded(coursesRef, (data) => {
      const { courseTitle, gid } = data.val();
      courseGidMap.set(courseTitle, gid);
      setCourseGidMap((prevMap) => prevMap.set(courseTitle, gid));
      const courseTitles = Array.from(courseGidMap.keys());
      setCourseOptions(
        courseTitles.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))
      );
    });
  }, []);

  const handleCourseName = (e) => {
    setCourseName(e.target.value);
  };

  useEffect(() => {
    const getGid = courseGidMap.get(courseName);
    setGid(getGid);
  }, [courseName]);

  return (
    <>
      <div className="prose flex flex-col p-6">
        <h1 className="text-center">Attendance</h1>
        <div className="mb-5 form-control w-full">
          <div className="label">
            <span className="label-text">Course Name</span>
          </div>
          <select
            className="select select-bordered"
            value={courseName}
            onChange={handleCourseName}
          >
            <option disabled>Select Course</option>
            {courseOptions}
          </select>
        </div>
        <QuizData gid={gid} courseName={courseName} />
      </div>
    </>
  );
};
