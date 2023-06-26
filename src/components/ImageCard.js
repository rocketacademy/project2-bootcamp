import React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


export default function ImageTile(props) {
  //Function: Takes in the image props and display them
  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
  ]);
  const [showInput, setShowInput]=React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value); //Updating the texts of the component
  };
  
  const handleImageClick = () => {
    setShowInput(true);
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowInput(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


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
            key={props.item.img}
            cols={props.item.cols || 1}
            rows={props.item.rows || 1}
          >
            <img
              {...srcset(props.item.img, 720, props.item.rows, props.item.cols)}
              alt={props.item.title}
              loading="lazy"
              onClick={handleImageClick}
            />
            {showInput && (
            <div className="overlay">
              <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} />
            </div>
            )}

          <Box
              component={'span'}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
                backgroundColor: "rgba(255,255,255,0.5)",
                
              }}
            >
            {chipData.map((data) => { //this data will be replaced by component tagging
  return (
    <ListItem key={data.key}>
      <Chip
        label={data.label}
        onDelete={handleDelete(data)}
        variant=""
        color="primary"
        size="small"
      />
    </ListItem>
  );
}
)}
          </Box>

          </ImageListItem>
  );
}

