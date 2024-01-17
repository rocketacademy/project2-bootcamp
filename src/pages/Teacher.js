import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Chart } from "react-google-charts";
import useLoadChartData from "../hooks/useLoadData";
import useLoadCourseSearch from "../hooks/useLoadCourseSearch";
import axios from "axios";

const Teacher = () => {
  const { initialGid, initialCourse } = useLoadChartData();
  const [count, setCount] = useState(null);

  console.log(count);
  const [gid, setGid] = useState(null);
  // console.log(gid);
  const { courseOptions, courseGidMap } = useLoadCourseSearch();
  const [courseName, setCourseName] = useState("");
  const navigate = useNavigate();

  const spreadSheetId = "16HTIiiOq82Tm1tLHRQcr_8YJnO81QxZOOBOfR4hU3zc";

  const fetchAllUsers = () => {
    const usersRef = ref(db, "Student");
    onValue(usersRef, (snapshot) => {
      console.log(snapshot.val());
    });
  };
  fetchAllUsers();
  useEffect(() => {
    const fetchCount = async () => {
      await axios
        .get(
          `https://docs.google.com/spreadsheets/d/${spreadSheetId}/export?format=csv&gid=${initialGid}`
        )
        .then((res) => {
          const numEntries = parseCSVToArr(res.data);
          setCount(numEntries);
        });
    };
    if (initialGid) {
      fetchCount();
    }
  }, [initialGid]);

  const parseCSVToArr = (csvText) => {
    const rows = csvText.split(/\r?\n/);
    console.log(rows);
    const data = [];
    for (const row of rows) {
      const rowData = row.split(", ");
      data.push(rowData);
    }
    return data.length - 1;
  };

  useEffect(() => {
    const getGid = courseGidMap.get(courseName);
    setGid(getGid);
    setCourseName(courseName);
  }, [courseName]);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          `https://docs.google.com/spreadsheets/d/${spreadSheetId}/export?format=csv&gid=${gid}`
        )
        .then((res) => {
          const numEntries = parseCSVToArr(res.data);
          console.log(numEntries);
          setCount(numEntries);
        });
    };
    if (gid) {
      fetchData();
    }
  }, [gid]);

  useEffect(() => {
    if (initialCourse) {
      setCourseName(initialCourse);
    }
  }, [initialCourse]);

  const data = [
    ["Course", "Completion Rate "],
    [courseName, count],
  ];

  const options = {
    vAxis: { title: "Completion rate (%)" },
    hAxis: { title: "Course Name" },
    seriesType: "bars",
    series: { 5: { type: "line" } },
  };

  return (
    <>
      {/* <div class="flex flex-col text-sm p-4 mt-4 justify-end">
        <div>TEACHER NAME</div>
        <div>Teacher</div>
        <span class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg
            class="absolute w-12 h-12 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
      </div> */}
      {/* <p>hi {user}</p> */}
      <div class="h-screen  p-20">
        <div class="text-left">
          <p class="text-sm font-bold">Quick Access</p>
        </div>
        <div class="space-x-20 flex shadow-lg rounded-lg dark:bg-[#fdba74] p-10 mb-20 mt-2.5">
          <div>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 inline-block"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                />
              </svg>
            </button>
            <p class="text-sm">Attendance</p>
          </div>
          <div>
            <button onClick={() => navigate("resources")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 inline-block "
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>
            </button>
            <p class="text-sm">Resources</p>
          </div>
        </div>
        <div class="flex flex-end relative">
          <div class="absolute inset-y-0  flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
        <select
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        >
          {courseOptions}
        </select>
        <Chart
          chartType="ComboChart"
          data={data}
          options={options}
          width={"100%"}
          height={"300px"}
        />
      </div>
      <button onClick={() => navigate("settings")}>Settings</button>
    </>
  );
};

export default Teacher;
