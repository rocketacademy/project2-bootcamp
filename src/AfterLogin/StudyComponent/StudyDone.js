import { Button, Dialog, DialogContent, LinearProgress } from "@mui/material";
import "../../AfterLogin/Study.css";

export default function StudyDone({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="dialog">
        Well done! You have finished reviewing this deck.
        <br />
        <Button onClick={onClose}>Go Back to Homepage</Button>
      </DialogContent>
    </Dialog>
  );
}
