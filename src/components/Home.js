import React, { useEffect, useState } from "react";
import ImageTile from "./ImageTile";
import SearchBar from "./SearchBar";
import ImgDownload from "./ImgDownload";

//Firebase - Pull data from server
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";

const IMAGEOBJECT_FOLDER_NAME = "imageObjects";

const Home = () => {
  const [imageObjects, setImageObjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // This effect will run when the component mounts and whenever the 'yourCollection' data changes in Firebase.
    // You can perform any necessary operations here, such as updating state, manipulating the data, etc.
    // Make sure to handle any cleanup if required (return a cleanup function).
    const imgListRef = databaseRef(database, IMAGEOBJECT_FOLDER_NAME);
    // Subscribe to the Firebase listener
    //console.log(imgListRef);

    return () => {
      // This code will run when the component unmounts
      // You can perform any necessary cleanup here
      onChildAdded(imgListRef, (data) => {
        // Add the subsequent child to local component state, initialising a new array to trigger re-render
        //console.log(data.val().imgurl)
        setImageObjects(
          (preImageObjects) =>
            // Store message key so we can use it as a key in our list items when rendering messages
            [
              ...preImageObjects,
              {
                key: data.key,
                imgurl: data.val().imgurl, //from fdb
                tagsarray: data.val().tagsarray, //from fdb
                email: data.val().email, //from fdb
                name: data.val().name, //from fdb
                pass: data.val().pass, //from fdb
              },
            ] //key-value pair
        );

        setFilteredData(
          (preImageObjects) =>
            // Store message key so we can use it as a key in our list items when rendering messages
            [
              ...preImageObjects,
              {
                key: data.key,
                imgurl: data.val().imgurl, //from fdb
                tagsarray: data.val().tagsarray, //from fdb
                email: data.val().email, //from fdb
                name: data.val().name, //from fdb
                pass: data.val().pass, //from fdb
              },
            ] //key-value pair
        );
      });
    };
  }, []);

  // console.log(imageObjects)
  // extracting the key and the image only for downloading
  useEffect(() => {
    const itemData = filteredData.map(({ key, imgurl, tagsarray, email, name, pass }) => ({
      key: key,
      imgurl: imgurl,
      tagsarray: tagsarray,
      email: email,
      name: name,
      pass: pass,
      title: null,
    }));

    setImageObjects(itemData);
    console.log(`Initial Filtered Data: ${filteredData}`)
  }, []);

  //Function that filters data based on input
  const filterData = (searchTerm) => {
    const keywords = searchTerm.toLowerCase().split(" "); //split by spaces

    if (searchTerm === "") {
      //if empty text return keyword filter will be default
      const filteredData = imageObjects.filter((item) => {
        // Check if any hobby has the category "Art"
        return item.tagsarray.some((tags) => tags.label === "default");
      });
      setFilteredData(filteredData);
    } else {
      for (const element of keywords) {
        const filteredData = imageObjects.filter((item) => {
          // Check if any hobby has the category "Art"
          return item.tagsarray.some((tags) => tags.label === element);
        });
        setFilteredData(filteredData);
      }
    }
  };

  return (
    <div>
      <SearchBar onSearch={filterData} />
      {console.log(filteredData)}
      {console.log(`Image Objects: ${JSON.stringify(imageObjects)}`)}
      <ImgDownload ImageObjects={filteredData} />
      <header className="App-header">
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <div className="Gallery-img">
          <ImageTile ImageObjects={filteredData} />
        </div>
      </header>
    </div>
  );
};

export default Home;
