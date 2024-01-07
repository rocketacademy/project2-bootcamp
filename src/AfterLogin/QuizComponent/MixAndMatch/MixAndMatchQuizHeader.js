import { Button, Dialog } from "@mui/material";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//mc question page header
export default function MixAndMatchQuizHeader() {
  const [dialog, setDialog] = useState(false);
  const navi = useNavigate();

  return (
    <div className="quiz-header">
      <Dialog open={dialog}>
        <div className="dialog">
          Are you sure you want to exit?
          <p>All progress will not be saved</p>
          <div className="dialog-button-div">
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
        <h3>Mix and Match Quiz</h3>
        <DisabledByDefaultOutlinedIcon
          onClick={() => setDialog(true)}
          className="exit-button"
        />
      </div>
      <br />
      <h6>Please drag the spanish word and drop it next to the english word</h6>
    </div>
  );
}
