import { useMemo, useState } from "react";
import Translator from "../../Controller/Translator";
import { Autocomplete, Button, Card, TextField } from "@mui/material";
import ErrorPage from "../../ErrorPage";
import LoadingButton from "@mui/lab/LoadingButton";
import TextToSpeech from "../../Controller/TextToSpeech";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import "./EditCardForm.css";
import { useTheme } from "@mui/material/styles";

export default function EditCardForm(props) {
  const card = props.card;
  const isDisable = props.editing !== card.cardID;
  const isEditDisable = props.editing && props.editing !== card.cardID;
  const [userInputValue, setUserInputValue] = useState(card.english);
  const [options, setOptions] = useState([card.spanish]);
  const [translationValue, setTranslationValue] = useState(card.spanish);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(false);
  const theme = useTheme();
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
      if (userInputValue && translationValue) {
        if (props.englishToSpanish) {
          props.handleConfirmEdit(userInputValue, translationValue);
        } else {
          props.handleConfirmEdit(translationValue, userInputValue);
        }
        props.setEditing(null);
      } else {
        setErrorMessage("Fill out both fields before saving the card");
      }
    } else {
      props.setEditing(card.cardID);
    }
  };

  const handleTranslate = async () => {
    try {
      if (props.englishToSpanish) {
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

  const handlePlayAudio = async (word) => {
    try {
      setLoadingAudio(true);
      await audioHandler.playAudio(word);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const playAudioButton = (
    <div className="play-audio-button">
      <LoadingButton
        loading={loadingAudio}
        onClick={() => {
          handlePlayAudio(translationValue);
        }}
      >
        <VolumeUpIcon />
      </LoadingButton>
    </div>
  );

  return (
    <div>
      <Card className="edit-card">
        <ErrorPage
          errorMessage={errorMessage}
          handleErrorMessage={() => setErrorMessage("")}
        />
        <div className="edit-card-buttons">
          <div className="edit-card-button">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgb(79, 110, 247)",
                color: "white",
                padding: 0.5,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "8px",
                  padding: 0,
                },
                [theme.breakpoints.up("md")]: {
                  fontSize: "10px",
                },
                [theme.breakpoints.up("lg")]: {
                  fontSize: "12px",
                },
              }}
              disabled={isEditDisable}
              onClick={handleEdit}
            >
              {props.editing === card.cardID ? <CheckIcon /> : <EditIcon />}
            </Button>
          </div>
          <div className="edit-card-button">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgb(79, 110, 247)",
                color: "white",
                padding: 0.5,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "8px",
                  padding: 0,
                },
                [theme.breakpoints.up("md")]: {
                  fontSize: "10px",
                },
                [theme.breakpoints.up("lg")]: {
                  fontSize: "12px",
                },
              }}
              onClick={() => props.handleDelete(card.cardID)}
            >
              <ClearIcon />
            </Button>
          </div>
        </div>
        <div className="edit">
          <div className="field-audio">
            <div className="field">
              <TextField
                className="user-input"
                disabled={isDisable}
                fullWidth
                value={userInputValue}
                onChange={(e) => setUserInputValue(e.target.value)}
                label={props.englishToSpanish ? "English" : "Spanish"}
                variant="standard"
                sx={{ marginTop: 4, marginBottom: 2 }}
              ></TextField>
            </div>
            {!props.englishToSpanish && playAudioButton}
          </div>
          <div className="translate-button">
            <Button
              variant="contained"
              disabled={isDisable}
              sx={{
                backgroundColor: "rgb(79, 110, 247)",
                color: "white",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "8px",
                },
                [theme.breakpoints.up("md")]: {
                  fontSize: "10px",
                },
                [theme.breakpoints.up("lg")]: {
                  fontSize: "12px",
                },
              }}
              onClick={() => handleTranslate()}
            >
              Translate
            </Button>
          </div>
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
                fullWidth
                id="combo-box-demo"
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    label={
                      props.englishToSpanish
                        ? "Spanish translation"
                        : "English translation"
                    }
                    sx={{
                      marginTop: 2,
                    }}
                  />
                )}
              />
            </div>

            {props.englishToSpanish && playAudioButton}
          </div>
        </div>
      </Card>
    </div>
  );
}
