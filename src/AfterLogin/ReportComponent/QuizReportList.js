import { useParams } from "react-router-dom";

export default function QuizReportList() {
  const { quizNo } = useParams();
  return <div className="page">QuizList</div>;
}
