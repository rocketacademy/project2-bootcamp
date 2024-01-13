import { useState } from "react";
import DBHandler from "./Controller/DBHandler";
import LoadingButton from "@mui/lab/LoadingButton";

export default function SecretPage() {
  const dbHandler = new DBHandler();
  const [loading, setLoading] = useState(false);
  return (
    <div className="App">
      <LoadingButton
        variant="contained"
        loading={loading}
        onClick={async () => {
          setLoading(true);
          await dbHandler.clearUpData();
          setLoading(false);
        }}
      >
        Clear Unused Data
      </LoadingButton>
    </div>
  );
}
