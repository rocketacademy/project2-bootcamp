import { Button, Dialog, DialogContent } from "@mui/material";
import "../../AfterLogin/Study.css";

export default function SaveDone({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="dialog">
        Saved!
        <br />
        <Button onClick={onClose}>Go Back to Homepage</Button>
      </DialogContent>
    </Dialog>
  );
}
