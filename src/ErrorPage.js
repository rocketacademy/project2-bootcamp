import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function ErrorPage({ errorMessage, handleErrorMessage }) {
  return (
    <Dialog open={!!errorMessage} onClose={handleErrorMessage}>
      <DialogTitle>{errorMessage}</DialogTitle>
      <DialogContent className="error-dialog-content">
        <p>Please contact developer at developer@dev.com if you need help.</p>
        <Button
          sx={{
            backgroundColor: "rgb(79, 110, 247)",
            color: "white",
            ":hover": {
              backgroundColor: "#7089f5",
            },
          }}
          onClick={handleErrorMessage}
        >
          Back
        </Button>
      </DialogContent>
    </Dialog>
  );
}
