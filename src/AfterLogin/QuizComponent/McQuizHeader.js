import { Button, Dialog, LinearProgress } from "@mui/material";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function McQuizHeader(props) {
  const [dialog, setDialog] = useState(false);
  const navi = useNavigate();

  return (
    <div className="quiz-header">
      <Dialog open={dialog}>
        <div className="dialog">
          Are you sure you want to exit?
          <p>All progress will not be saved</p>
          <div className="button-div">
            <Button variant="contained" onClick={() => navi("/")}>
              yes
            </Button>
            <Button variant="contained" onClick={() => setDialog(false)}>
              no
            </Button>
          </div>
        </div>
      </Dialog>
      <div className="quiz-subheader">
        <h3>{props.questions[props.currentQuestion].deckName}</h3>
        <DisabledByDefaultOutlinedIcon
          onClick={() => setDialog(true)}
          className="exit-button"
        />
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
