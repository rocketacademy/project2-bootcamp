import { Outlet, useParams } from "react-router-dom";

export default function QuizList() {
  const { quizNo } = useParams();
  console.log(quizNo);
  return (
    <div>
      QuizList
      <Outlet />
    </div>
  );
}
