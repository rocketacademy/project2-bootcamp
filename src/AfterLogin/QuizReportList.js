import { Outlet, useParams } from "react-router-dom";

export default function QuizReportList() {
  const { quizNo } = useParams();
  return (
    <div>
      QuizList
      <Outlet />
    </div>
  );
}
