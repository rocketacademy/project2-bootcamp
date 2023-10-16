import { useState } from "react";

//<ImageCarousel urlArray = {filePreviewArray} />
export function ImageCarousel(props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const rotateCurrentImage = (direction) => {
    if (direction === "up") {
      if (currentImageIndex === props.urlArray.length - 1) {
        setCurrentImageIndex(0);
      } else {
        setCurrentImageIndex((prevState) => prevState + 1);
      }
    } else if (direction === "down") {
      if (currentImageIndex === 0) {
        setCurrentImageIndex(props.urlArray.length - 1);
      } else {
        setCurrentImageIndex((prevState) => prevState - 1);
      }
    }
  };
  if (props.urlArray.length === 0) {
    return null;
  } else if (props.urlArray.length === 1) {
    return <img src={props.urlArray[0]} />;
  } else {
    return (
      <div className="bg-window">
        <div className="carousel relative flex w-full justify-center">
          {/* static flex flex-col */}

          <img
            src={props.urlArray[currentImageIndex]}
            className="max-h-1/4 flex"
          />

          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform flex-row justify-between">
            <button
              className="btn btn-circle"
              onClick={() => rotateCurrentImage("down")}
            >
              ❮
            </button>
            <button
              className="btn btn-circle"
              onClick={() => rotateCurrentImage("up")}
            >
              ❯
            </button>
          </div>
          {/* <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <div onClick = {()=>rotateCurrentImage('down')} className="btn btn-circle">❮</div>
                    <div onClick = {()=>rotateCurrentImage('up')} className="btn btn-circle">❯</div>
                </div> */}
        </div>
        <p className="border-y-2 border-black text-center">
          {" "}
          Image {currentImageIndex + 1} of {props.urlArray.length}
        </p>
      </div>

      // <div className="carousel w-full">
      //     {props.urlArray.map((fileURL, index, arr) => { //account for case of 1 file
      //         const prevIndex = (index === 0 ? arr.length - 1 : index - 1)
      //         const nextIndex = (index === arr.length ? 0 : index + 1)
      //         return (
      //             <div id={`slide${index}`} className="carousel-item relative w-full" key={fileURL}>
      //                 <img src={fileURL} className="w-full" />
      //                 <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      //                     <a href={`slide${prevIndex}`} className="btn btn-circle">❮</a>
      //                     <a href={`slide${nextIndex}`} className="btn btn-circle">❯</a>
      //                 </div>
      //             </div>
      //         )
      //     })}
      // </div>
    );
  }
}
