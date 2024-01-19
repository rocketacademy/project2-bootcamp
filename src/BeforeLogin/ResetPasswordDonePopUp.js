import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function ResetPasswordDonePopUp({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Success!</DialogTitle>
      <DialogContent sx={{ marginTop: "15px" }}>
        A link to reset your password has been sent to your email!
        <Button onClick={onClose} sx={{ marginTop: "35px" }}>
          Go back to log in page
        </Button>
      </DialogContent>
    </Dialog>
  );
}
