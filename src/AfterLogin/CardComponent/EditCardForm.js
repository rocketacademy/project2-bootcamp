import { useMemo, useState } from "react";
import Translator from "../../Controller/Translator";
import { Autocomplete, Button, Card, TextField } from "@mui/material";
import ErrorPage from "../../ErrorPage";
import LoadingButton from "@mui/lab/LoadingButton";
import TextToSpeech from "../../Controller/TextToSpeech";

export default function EditCardForm(props) {
  const card = props.card;
  const isDisable = props.editing !== card.cardID;
  const isEditDisable = props.editing && props.editing !== card.cardID;
  const [englishValue, setEnglishValue] = useState(card.english);
  const [spanishOptions, setSpanishOptions] = useState([card.spanish]);
  const [englishOptions, setEnglishOptions] = useState([card.english]);
  const [spanishValue, setSpanishValue] = useState(card.spanish);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [englishInput, setEnglishInput] = useState(true);
  const translator = useMemo(
    () => new Translator(setErrorMessage, process.env.REACT_APP_SPANISH_KEY),
    [setErrorMessage]
  );
  const audioHandler = useMemo(
    () =>
      new TextToSpeech(
        setErrorMessage,
        setLoadingAudio,
        process.env.REACT_APP_OPENAI_KEY
      ),
    [setErrorMessage, setLoadingAudio]
  );

  const handleEdit = () => {
    if (props.editing) {
      props.setEditing(null);
      if (props.englishInput) {
        props.handleConfirmEdit(englishValue, spanishValue);
      } else props.handleConfirmEdit(spanishValue, englishValue);
    } else {
      props.setEditing(card.cardID);
    }
  };

  const handleTranslate = async () => {
    if (props.englishInput) {
      try {
        const translationToSpan = await translator.engToSpan(englishValue);
        setSpanishOptions(translationToSpan);
        setSpanishValue(translationToSpan[0]);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      try {
        const translationToEng = await translator.spanToEng(englishValue);
        setEnglishOptions(translationToEng);
        setSpanishValue(translationToEng[0]);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleLanguageSwitch = () => {};

  const handlePlayAudio = async (word) => {
    try {
      setLoadingAudio(true);
      await audioHandler.playAudio(word);
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
        <Button onClick={handleLanguageSwitch}>Switch languages</Button>
        <Button disabled={isDisable} onClick={() => handleTranslate()}>
          Translate
        </Button>
        <Button onClick={() => props.handleDelete(card.cardID)}>Delete</Button>
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
            label={props.englishInput ? "English" : "Spanish"}
            variant="standard"
          ></TextField>
        </div>
        <br />
        <div className="field-audio">
          <div className="field">
            <Autocomplete
              value={spanishValue}
              disabled={isDisable}
              options={props.englishInput ? spanishOptions : englishOptions}
              onChange={(e, input) => {
                setSpanishValue(input);
              }}
              onInputChange={(e, input) => {
                setSpanishValue(input);
              }}
              autoSelect
              freeSolo
              disablePortal
              id="combo-box-demo"
              sx={{ width: 350 }}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    props.englishInput
                      ? "Spanish translation"
                      : "English translation"
                  }
                />
              )}
            />
          </div>
          <LoadingButton
            loading={loadingAudio}
            onClick={() => {
              handlePlayAudio(spanishValue);
            }}
          >
            🔊
          </LoadingButton>
        </div>
      </div>
    </Card>
  );
}
