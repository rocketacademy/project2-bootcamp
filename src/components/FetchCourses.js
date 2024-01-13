import axios from "axios";

export const fetchAttemptedCourses = async (
  spreadsheetId,
  courseGidMap,
  userEmail
) => {
  const attemptedCoursesResults = [];

  for (const [courseTitle, courseGid] of courseGidMap.entries()) {
    const publicSheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${courseGid}`;
    const response = await axios.get(publicSheetUrl);
    const csvData = response.data;
    const rows = csvData.split("\n");
    const parsedData = rows.map((row) => row.split(","));
    const userAttemptedCourse = parsedData
      .slice(1)
      .some((row) => row[1] === userEmail);

    attemptedCoursesResults.push({
      courseTitle: courseTitle,
      hasAttempted: userAttemptedCourse,
    });
  }

  return attemptedCoursesResults;
};
