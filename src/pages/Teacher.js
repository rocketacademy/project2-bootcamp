import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart } from "react-google-charts";
import useLoadChartData from "../hooks/useLoadData";
import useLoadCourseSearch from "../hooks/useLoadCourseSearch";
import useLoadStudent from "../hooks/useLoadStudents";
import axios from "axios";
import { AuthContext } from "../pages/AuthProvider";
import { useContext } from "react";

const Teacher = () => {
  const { currentUser } = useContext(AuthContext);
  const { initialGid, initialCourse } = useLoadChartData(0);
  const [count, setCount] = useState(0);
  const [gid, setGid] = useState(null);
  const { courseOptions, courseGidMap } = useLoadCourseSearch();
  const { studentCount } = useLoadStudent();
  const [courseName, setCourseName] = useState("");
  const [remainingCount, setRemainingCount] = useState(0);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const spreadSheetId = "16HTIiiOq82Tm1tLHRQcr_8YJnO81QxZOOBOfR4hU3zc";

  // useEffect(() => {
  //   if (studentCount && count) {
  //     setRemainingCount(studentCount - count);
  //   }
  // }, [count]);

  // useEffect(() => {
  //   const fetchCount = async () => {
  //     await axios
  //       .get(
  //         `https://docs.google.com/spreadsheets/d/${spreadSheetId}/export?format=csv&gid=${initialGid}`
  //       )
  //       .then((res) => {
  //         const numEntries = getNumOfAttemptedStudents(res.data);
  //         console.log(numEntries);
  //         setCount(numEntries);
  //       });
  //   };
  //   if (initialGid && studentCount) {
  //     fetchCount();
  //   }
  // }, [initialGid, studentCount]);

  const getNumOfAttemptedStudents = (csvText) => {
    const attemptedStudents = new Set(); //set ensures unique values
    const rows = csvText.split(/\r?\n/);
    const parsedRows = rows.map((row) => row.split(","));

    parsedRows.slice(1).map((row, rowIndex) => {
      const [timeStamp, emailAddress] = row; //get email address from each row
      attemptedStudents.add(emailAddress.trim());
    });
    console.log(attemptedStudents);
    console.log(attemptedStudents.size);
    return attemptedStudents.size;
  };

  useEffect(() => {
    const getGid = courseGidMap.get(courseName);
    setGid(getGid);
  }, [courseName]);

  const fetchData = async () => {
    await axios
      .get(
        `https://docs.google.com/spreadsheets/d/${spreadSheetId}/export?format=csv&gid=${gid}`
      )
      .then((res) => {
        const numEntries = getNumOfAttemptedStudents(res.data);
        setCount(numEntries);
        setRemainingCount(studentCount - numEntries);
      });
  };

  useEffect(() => {
    if (gid) {
      fetchData();
    }
  }, [gid]);

  // when page first loads
  useEffect(() => {
    if (initialCourse) {
      setCourseName(initialCourse);
    }
  }, [initialCourse]);

  console.log(count);
  console.log(remainingCount);

  useEffect(() => {
    setData([
      ["Courses", "Completion rate (%)"],
      ["Completed", (count / studentCount) * 100],
      ["Not Completed", (remainingCount / studentCount) * 100],
    ]);
  }, [count, studentCount, remainingCount]);

  console.log(data);
  const options = {
    title: `${courseName} Completion Rate`,
    backgroundColor: "transparent",
    chartArea: { width: "100%", height: "90%" },
    legend: { position: "right", alignment: "center" },
    is3D: true,
    colors: ["#8AA2A0", "#a28a8c"],
  };
  return (
    <>
      <div className="prose mt-8 p-6 grid grid-cols-1 gap-y-8 max-w-full sm:grid-cols-6">
        <h1 className="text-center text-gray-600 sm:col-span-6">
          {currentUser && `Hello, ${currentUser.displayName}`}
        </h1>
        <div className="mb-5 form-control sm:col-start-3 col-span-2 ">
          <div className="label">
            <span className="label-text">Course Name</span>
          </div>
          <select
            className="select select-bordered max-w-full"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          >
            {courseOptions}
          </select>
        </div>

        {remainingCount < 0 ? (
          <>
            <span className="loading loading-dots loading-lg sm:col-start-4 sm:col-span-1"></span>
            <p className="text-center sm:col-span-6">
              Error loading, please refresh.
            </p>
          </>
        ) : (
          <div className="h-96 sm:col-start-2 sm:col-span-4">
            <Chart
              chartType="PieChart"
              data={data}
              options={options}
              width={"100%"}
              height={"100%"}
              loader={
                <span className="loading loading-dots loading-lg sm:col-span-6"></span>
              }
            />
          </div>
        )}
      </div>
    </>
  );
};
export default Teacher;
