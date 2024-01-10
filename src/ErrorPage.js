import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function ErrorPage({ errorMessage, handleErrorMessage }) {
  return (
    <Dialog open={!!errorMessage} onClose={handleErrorMessage}>
      <DialogTitle>{errorMessage}</DialogTitle>
      <DialogContent className="error-dialog-content">
        <p>Please contact developer if you need help.</p>
        <Button onClick={handleErrorMessage}>Back</Button>
      </DialogContent>
    </Dialog>
  );
}
