import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {Button} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

//Firebase
const IMAGES_FOLDER_NAME = "images"; //Images folder name

const ImgDownload = (props) => {
  const [imgUrl, setimgUrl] = useState(null);

  const downloadFilesAsZip = async (fileUrls) => {
    const zip = new JSZip();
  
    // Loop through the array of file URLs
    for (let i = 0; i < fileUrls.length; i++) {
      const fileUrl = fileUrls[i];
      try {
        // Fetch each file as an array buffer
        const response = await fetch(fileUrl);
        const fileData = await response.arrayBuffer();
  
        // Get the file name from the URL
        const fileName = decodeURIComponent(fileUrl.split('images%2F')[1].split('?')[0]);
  
        // Add the file to the ZIP
        zip.file(fileName, fileData);
      } catch (error) {
        console.log(`Error downloading file at ${fileUrl}:`, error);
      }
    }

    try {
      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
  
      // Save the ZIP file
      saveAs(zipBlob, 'files.zip');
    } catch (error) {
      console.log('Error generating ZIP file:', error);
    }}

  const mapDownload = () => {
    //map into an arrage of img links for download
    const objectList = props.ImageObjects;
    const urlArray = objectList.map(({ img }) => img);
    console.log(urlArray);
    setimgUrl(urlArray); //set the state for downloads
    downloadFilesAsZip(urlArray);
  };

  return (
    <div className="download-button">
      <Button onClick={mapDownload} variant="contained" endIcon={<DownloadIcon />}>
          Download
        </Button>
    </div>
  );
};

export default ImgDownload;
