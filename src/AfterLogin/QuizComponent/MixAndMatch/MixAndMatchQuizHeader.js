import { Button, Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//mc question page header
export default function MixAndMatchQuizHeader() {
  const [dialog, setDialog] = useState(false);
  const navi = useNavigate();

  return (
    <div className="quiz-header">
      <Dialog open={dialog}>
        <DialogContent className="dialog">
          Are you sure you want to exit?
          <p>All progress will not be saved</p>
          <div className="dialog-button-div">
            <Button
              className="quiz-selection-button"
              variant="contained"
              onClick={() => navi("/")}
            >
              yes
            </Button>
            <Button
              className="quiz-selection-button"
              variant="contained"
              onClick={() => setDialog(false)}
            >
              no
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="quiz-subheader">
        <h3>Mix and Match Quiz</h3>
        <CloseIcon onClick={() => setDialog(true)} className="exit-button" />
      </div>
      <br />
      <h6>Please drag the spanish word and drop it next to the english word</h6>
    </div>
  );
}
