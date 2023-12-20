import { LinearProgress } from "@mui/material";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";

export default function McQuizHeader(props) {
  return (
    <div className="quiz-header">
      <div className="quiz-subheader">
        <h2>{props.questions[props.currentQuestion].deckName}</h2>
        <DisabledByDefaultOutlinedIcon />
        {/* Need to add confirmation leaving dialog for this icon*/}
      </div>
      <span className="progress-number">{props.currentQuestion + 1}/10</span>
      <LinearProgress
        variant="determinate"
        value={(props.currentQuestion + 1) * 10}
        className="progress-bar"
      />
    </div>
  );
}
