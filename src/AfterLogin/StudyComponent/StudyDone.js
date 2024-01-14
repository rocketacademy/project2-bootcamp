import { Button, Dialog, DialogContent } from "@mui/material";
import "../../AfterLogin/Study.css";

export default function StudyDone({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ elevation: 0, variant: "outlined" }}
    >
      <DialogContent className="study-done-dialog">
        <h2>✨Well done!</h2>
        You have finished reviewing this deck.
        <br />
        <br />
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
