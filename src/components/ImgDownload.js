import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const handleDownload = (imageUrls) => {
    const zip = new JSZip();
    // const imageUrls = ['image1.jpg', 'image2.png', 'image3.gif']; // Replace with the URLs or file paths of your images
  
    const addImagesToZip = async () => {
      const imagePromises = imageUrls.map((url) => {
        return fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const filename = url.substring(url.lastIndexOf('/') + 1);
            zip.file(filename, blob);
          });
      });
  
      await Promise.all(imagePromises);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'pixfolio-images.zip');
    };
  
    addImagesToZip();
  };

  
  const ImgDownload = () => {
    return (
      <div>
        <button onClick={handleDownload({props.imageUrls})}>Download Images</button>
      </div>
    );
  };
  
  export default ImgDownload;
  