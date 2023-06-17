import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ImgDownload = (props) => {
  const [imgUrl, setimgUrl] = useState(null);

  const handleDownload = (imageUrls) => {
    const zip = new JSZip();
    // const imageUrls = ['image1.jpg', 'image2.png', 'image3.gif']; // Replace with the URLs or file paths of your images
    const addImagesToZip = async () => {
      const imagePromises = imgUrl.map((url) => {
        return fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const filename = url.substring(url.lastIndexOf("/") + 1);
            zip.file(filename, blob);
          });
      });

      await Promise.all(imagePromises);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "pixfolio-images.zip");
    };

    addImagesToZip();
  };

  const mapDownload = () => {
    //map into an arrage of img links for download
    const objectList = props.ImageObjects;
    const imageUrls = objectList.map((imageObject) => imageObject.img);
    setimgUrl(imageUrls); //set the state for downloads
    handleDownload(imageUrls);
  };

  return (
    <div>
      <button onClick={mapDownload}>Download Images</button>
    </div>
  );
};

export default ImgDownload;
