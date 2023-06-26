import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageCard from './ImageCard';


export default function ImageTile(props) {
  //Function: Takes in the image props and display them
  return (    
    <div className="gallery-img">
      
      <ImageList sx={{ width: "100%" }} variant="masonry" cols={4} gap={8}>
        {props.ImageObjects.map((item) => (
          <ImageCard item={item}/>
        ))}
      </ImageList>
    </div>
  );
}

