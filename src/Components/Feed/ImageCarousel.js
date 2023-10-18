//-----------React-----------//
import { useState, useEffect } from "react";

//Props Format: <ImageCarousel urlArray = {filePreviewArray} />
export function ImageCarousel(props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleCurrentImage = (direction) => {
    if (direction === "left") {
      if (currentImageIndex === props.urlArray.length - 1) {
        setCurrentImageIndex(0);
      } else {
        setCurrentImageIndex((prevState) => prevState + 1);
      }
    } else if (direction === "right") {
      if (currentImageIndex === 0) {
        setCurrentImageIndex(props.urlArray.length - 1);
      } else {
        setCurrentImageIndex((prevState) => prevState - 1);
      }
    }
  };

  useEffect(() => {}, [props.urlArray]);
  // Return null if no images added to image carousel
  if (props.urlArray.length === 0) {
    return null;
  } else if (props.urlArray.length === 1) {
    // Return a single image if one image added to image carousel
    return (
      <img
        src={props.urlArray[0]}
        alt="display"
        className=" m-1 rounded-lg bg-background"
      />
    );
  } else {
    // Return multi image array with multiple images and side toggles
    return (
      <div>
        <div className="carousel relative m-1 flex max-h-52 w-full items-center justify-center rounded-lg bg-background">
          <p className="absolute left-2 top-2 rounded bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
            {currentImageIndex + 1} of {props.urlArray.length}
          </p>
          <img
            src={props.urlArray[currentImageIndex]}
            alt="display2"
            className="max-h-52 object-contain"
          />

          <div className="absolute left-3 right-3 top-1/2 flex -translate-y-1/2 flex-row justify-between">
            <button
              className="h-[2em] w-[2em] rounded-full bg-white hover:translate-x-[-3px] hover:bg-slate-300"
              onClick={() => toggleCurrentImage("right")}
            >
              ❮
            </button>
            <button
              className="h-[2em] w-[2em] rounded-full bg-white hover:translate-x-[3px] hover:bg-slate-300 hover:shadow-lg"
              onClick={() => toggleCurrentImage("left")}
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    );
  }
}
