import { useMemo, useState } from "react";
import Translator from "../../Controller/Translator";
import { Autocomplete, Button, Card, TextField } from "@mui/material";
import ErrorPage from "../../ErrorPage";
import LoadingButton from "@mui/lab/LoadingButton";
import TextToSpeech from "../../Controller/TextToSpeech";
import "./EditCardForm.css";

export default function EditCardForm(props) {
  const card = props.card;
  const isDisable = props.editing !== card.cardID;
  const isEditDisable = props.editing && props.editing !== card.cardID;
  const [userInputValue, setUserInputValue] = useState(card.english);
  const [options, setOptions] = useState([card.spanish]);
  const [translationValue, setTranslationValue] = useState(card.spanish);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [englishToSpanish, setEnglishToSpanish] = useState(true);
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
      if (englishToSpanish) {
        props.handleConfirmEdit(userInputValue, translationValue);
      } else props.handleConfirmEdit(translationValue, userInputValue);
    } else {
      props.setEditing(card.cardID);
    }
  };

  const handleTranslate = async () => {
    try {
      if (englishToSpanish) {
        const translationToSpan = await translator.engToSpan(userInputValue);
        setOptions(translationToSpan);
        setTranslationValue(translationToSpan[0]);
      } else {
        const translationToEng = await translator.spanToEng(userInputValue);
        setOptions(translationToEng);
        setTranslationValue(translationToEng[0]);
      }
    } catch (error) {
      setOptions([]);
      setTranslationValue("");
    }
  };

  const handleLanguageSwitch = () => {
    setEnglishToSpanish((prevEnglishInput) => !prevEnglishInput);
  };

  const handlePlayAudio = async (word) => {
    try {
      setLoadingAudio(true);
      await audioHandler.playAudio(word);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <Card className="edit-card">
        <ErrorPage
          errorMessage={errorMessage}
          handleErrorMessage={() => setErrorMessage("")}
        />
        <div className="edit-card-buttons">
          <Button disabled={isDisable} onClick={handleLanguageSwitch}>
            Switch languages
          </Button>
          <Button disabled={isDisable} onClick={() => handleTranslate()}>
            Translate
          </Button>

          <Button onClick={() => props.handleDelete(card.cardID)}>
            Delete card
          </Button>
          <Button disabled={isEditDisable} onClick={handleEdit}>
            {props.editing === card.cardID ? "Save card" : "Edit"}
          </Button>
        </div>
        <div className="edit">
          <div className="field">
            <TextField
              className="user-input"
              disabled={isDisable}
              fullWidth
              value={userInputValue}
              onChange={(e) => setUserInputValue(e.target.value)}
              label={englishToSpanish ? "English" : "Spanish"}
              variant="standard"
              sx={{ marginTop: 4 }}
            ></TextField>
          </div>
          <br />
          <div className="field-audio">
            <div className="field">
              <Autocomplete
                value={translationValue}
                disabled={isDisable}
                options={options}
                onChange={(e, input) => {
                  setTranslationValue(input);
                }}
                onInputChange={(e, input) => {
                  setTranslationValue(input);
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
                      englishToSpanish
                        ? "Spanish translation"
                        : "English translation"
                    }
                  />
                )}
              />
            </div>
            <div className="play-audio-button">
              <LoadingButton
                loading={loadingAudio}
                onClick={() => {
                  handlePlayAudio(translationValue);
                }}
              >
                🔊
              </LoadingButton>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
