import React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { database } from "../firebase";
import { ref as databaseRef, update } from "firebase/database";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ImageTile(props) {
  //Function: Takes in the image props and display them
  const [chipData, setChipData] = React.useState(props.item.tagsarray); //Initial empty array
  const [showInput, setShowInput] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef(null);
  const imgRef = React.useRef(null);

  // 1. Function to set state on the files upon dropping
  const IMAGEOBJECT_FOLDER_NAME = "imageObjects";

  const handleInputChange = (event) => {
    setInputValue(event.target.value); //Updating the texts of the component
  };

  const handleImageClick = () => {
    console.log(`Image clicked: ${props.item.key}`);
    setShowInput(!showInput);
  };

  const handleDelete = (chipToDelete) => () => {
    console.log(chipToDelete);
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const handleClickOutside = (event) => {
    if (
      imgRef.current &&
      !imgRef.current.contains(event.target) &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      console.log("clickedout");
      console.log(showInput);
      setShowInput(false);
      setInputValue(""); //reset the input
    }
  };

  //This function updates the new object array for the chip
  const addChipFormat = (chipValue) => {
    let arrayData = [...chipData]; //copy value
    chipValue = chipValue.replace(/\s/g, "");
    console.log(`Array Chip Length: ${arrayData.length}`);
    if (arrayData.length !== 0) {
      //if not empty
      let lastKeyValue = arrayData[arrayData.length - 1].key;
      let objectAppend = {
        key: lastKeyValue + 1, //running number
        label: chipValue.toLowerCase(),
      };
      arrayData.push(objectAppend); //appends to the object array
      console.log(arrayData);
      return arrayData;
    } else {
      return [
        {
          key: 1,
          label: chipValue.toLowerCase(),
        },
      ];
    }
  };

  //This handles the keyboard enter key to register submission
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Perform any necessary logic here
      console.log(inputValue);
      if (inputValue !== "") {
        setChipData(addChipFormat(inputValue)); //append to the chip data

        //Writing data into the database
        const objectPath = IMAGEOBJECT_FOLDER_NAME + "/" + props.item.key;
        const postListRef = databaseRef(database, objectPath);
        console.log(`Path: ${objectPath}`);
        console.log(`postListRef: ${postListRef}`);
        // Update the parameter to firebase
        update(postListRef, { tagsarray: addChipFormat(inputValue) })
          .then(() => {
            console.log("Chips updated successfully");
          })
          .catch((error) => {
            console.error("Error updating Chips:", error);
          });

        setShowInput(false);
        setInputValue(""); //reset the input
      } else {
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  React.useEffect(() => {
    console.log(`chipData: ${chipData}`);
    // Writing data into the database
    const objectPath = `${IMAGEOBJECT_FOLDER_NAME}/${props.item.key}`;
    const postListRef = databaseRef(database, objectPath);
    console.log(`Path: ${objectPath}`);
    console.log(`postListRef: ${postListRef}`);
    // Update the parameter to Firebase
    update(postListRef, { tagsarray: chipData })
      .then(() => {
        console.log("Chips updated successfully");
      })
      .catch((error) => {
        console.error("Error updating Chips:", error);
      });
  }, [chipData]);

  //function to actually setup the sizes and image details for the tiling
  function srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  return (
    <ImageListItem
      key={props.item.imgurl}
      cols={props.item.cols || 1}
      rows={props.item.rows || 1}
    >
      <img
        {...srcset(props.item.imgurl, 720, props.item.rows, props.item.cols)}
        alt={props.item.title}
        loading="lazy"
        ref={imgRef}
        onClick={handleImageClick}
      />
      {showInput && (
        <div className="overlay">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            maxlength="8"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}

      <Box
        component={"span"}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      >
        {props.item.tagsarray !== null
          ? chipData.map((data) => {
              //this data will be replaced by component tagging
              return (
                <ListItem key={data.key}>
                  {data.label !== "default" && ( //hide default chip label but retain it
                    <Chip
                      label={data.label}
                      onDelete={handleDelete(data)}
                      variant=""
                      color="primary"
                      size="small"
                    />
                  )}
                </ListItem>
              );
            })
          : null}
      </Box>
    </ImageListItem>
  );
}
