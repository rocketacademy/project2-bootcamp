import { useMemo, useState } from "react";
import Translator from "../Controller/Translator";
import { Autocomplete, Button, Card, TextField } from "@mui/material";
import TextToSpeech from "../TextToSpeech";
import ErrorPage from "../../ErrorPage";

export default function EditCardForm(props) {
  const card = props.card;
  const isDisable = props.editing !== card.cardID;
  const isEditDisable = props.editing && props.editing !== card.cardID;
  const [englishValue, setEnglishValue] = useState(card.english);
  const [options, setOptions] = useState([card.spanish]);
  const [spanishValue, setSpanishValue] = useState(card.spanish);
  const [errorMessage, setErrorMessage] = useState("");
  const translator = useMemo(
    () => new Translator(setErrorMessage, process.env.REACT_APP_SPANISH_KEY),
    [setErrorMessage]
  );

  const handleEdit = () => {
    if (props.editing) {
      props.setEditing(null);
    } else {
      props.setEditing(card.cardID);
    }
  };

  const handleTranslate = async () => {
    try {
      const translation = await translator.engToSpan(englishValue);
      setOptions(translation);
      setSpanishValue(translation[0]);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Card className="edit-card">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <div className="edit-buttons">
        <Button disabled={isDisable} onClick={() => handleTranslate()}>
          Translate
        </Button>
        <Button
          disabled={isDisable}
          onClick={() => props.handleDelete(card.cardID)}
        >
          Delete
        </Button>
        <Button disabled={isEditDisable} onClick={handleEdit}>
          {props.editing === card.cardID ? "OK" : "Edit"}
        </Button>
      </div>
      <div className="edit">
        <div className="field">
          <TextField
            disabled={isDisable}
            fullWidth
            value={englishValue}
            onChange={(e) => setEnglishValue(e.target.value)}
            label="English"
            variant="standard"
          ></TextField>
        </div>
        <br />
        <div className="field-audio">
          <div className="field">
            <Autocomplete
              value={spanishValue}
              disabled={isDisable}
              options={options}
              onChange={(e, input) => {
                setSpanishValue(input);
              }}
              onInputChange={(e, input) => {
                setSpanishValue(input);
              }}
              freeSolo
              disablePortal
              id="combo-box-demo"
              sx={{ width: 350 }}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Spanish translation" />
              )}
            />
          </div>
          <TextToSpeech />
        </div>
      </div>
    </Card>
  );
}
