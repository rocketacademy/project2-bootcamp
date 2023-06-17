import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  FormLabel,
  InputAdornment,
  IconButton,
  Button,
  Snackbar,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SendIcon from "@mui/icons-material/Send";
import MuiAlert from "@mui/material/Alert";

function AdminUpload(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [files, setFiles] = useState([]);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  // 1. Function to set state on the files upon dropping

  // 2. Perform your form submission logic here, along with file upload handling

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform your form submission logic here, along with file upload handling
    // Access the selected files from the "files" state and include them in your form data
    // Perform form validation before submission
    if (isFormValid()) {
      // Submit the form
      setName(""); //Reset the form
      setEmail(""); //Reset the form
      setPass(""); //Reset the form
      setFiles([]); //Reset the form
      setOpenSuccessSnackbar(true);
      setOpenErrorSnackbar(false);
      console.log("Form submitted successfully");
      console.log("Form submitted with files:", files);
      // Additional submission logic
    } else {
      setOpenErrorSnackbar(true);
      setOpenSuccessSnackbar(false);
      console.log("Form is not valid. Please fill in all fields.");
    }
  };

  // Validate form fields
  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      pass.trim() !== "" &&
      files.length !== 0
    );
  };

  //handling value inputs and display

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePassChange = (event) => {
    setPass(event.target.value);
  };

  //2b. Password Generator
  function generateRandomPassword(length) {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }

  const genPass = () => {
    // Usage example
    const password = generateRandomPassword(8);
    setPass(password);
  };

  // 3. Dropzone Params: Restricting Dropzone to only images files
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div className="thumb" key={file.name}>
      <div className="thumbInner">
        <img
          alt="preview files"
          src={file.preview}
          className="img"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <div className="admin-form">
      <form onSubmit={handleSubmit} className="upload-form">
        <FormLabel sx={{ fontWeight: "bold" }}>
          {" "}
          User Account Creation
        </FormLabel>
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSuccessSnackbar}
        >
          <Alert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Form submitted successfully.
          </Alert>
        </Snackbar>
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseErrorSnackbar}
        >
          <Alert
            onClose={handleCloseErrorSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            Please fill in all fields!
          </Alert>
        </Snackbar>
        <TextField
          label="Customer Name"
          value={name}
          onChange={handleNameChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          type={"email"}
          onChange={handleEmailChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          disabled
          label="Unique Password"
          value={pass}
          onChange={handlePassChange}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" color="primary" onClick={genPass}>
                  <AutorenewIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div {...getRootProps({ className: "dropzone" })}>
          <div className="dropzone-area">
            <input {...getInputProps()} />
            <p style={{ flex: "0 0 100%" }}>
              Drag and drop image files here, or click to select files
            </p>
            <em style={{ flex: "0 0 100%" }}>
              (Only *.jpeg and *.png images will be accepted)
            </em>
          </div>
        </div>
        <aside className="thumbsContainer">{thumbs}</aside>
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default AdminUpload;
