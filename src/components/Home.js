import React, { useEffect, useState } from "react";
import ImageTile from "./ImageTile";
import SearchBar from "./SearchBar";
import ImgDownload from "./ImgDownload";
import { useAuth } from "./Auth";

//Firebase - Pull data from server
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";

const IMAGEOBJECT_FOLDER_NAME = "imageObjects";

const Home = () => {
  const [imageObjects, setImageObjects] = useState([]); //State 1
  const [filterTerms, setfilterTerms] = useState([]);
  const { currentUser } = useAuth();

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
        console.log(`Server Data: ${JSON.stringify(data)}`);
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
            ].map(({ key, imgurl, tagsarray, email, name, pass }) => ({
              key: key,
              imgurl: imgurl,
              tagsarray: tagsarray,
              email: email,
              name: name,
              pass: pass,
              title: null,
            })) //key-value pair
        );
      });
    };
  }, [filterTerms]);

  // console.log(imageObjects)
  // extracting the key and the image only for downloading

  const updateTerms = (searchTerm) => {
    const keywords = searchTerm.toLowerCase().split(" "); //split by spaces
    // setImageObjects([]); //reset data when search is clicked
    if (keywords[0] === "") {
      setfilterTerms([]); //when user search empty string
    } else {
      setfilterTerms(keywords);
    }
  };

  //Function that filters data based on input
  const filterData = (searchArray) => {
    let searchList = [];
    console.log(searchArray); //["mountain","purple"]
    //Email Filtering
    let emailFilter = imageObjects.filter(
      (obj) => obj.email === currentUser.email
    );
    //Duplicates Filtering
    const uniqueArray = Object.values(
      emailFilter.reduce((acc, obj) => {
        acc[obj.key] = obj;
        return acc;
      }, {})
    );
    //Looping through tags
    if (searchArray.length > 0) {
      for (const element of searchArray) {
        const filteredData = uniqueArray.filter((item) => {
          // Check if any hobby has the category "Art"
          return item.tagsarray.some((tags) => tags.label === element);
        });

        console.log(`Filtered Data: ${JSON.stringify(filteredData)}`);
        searchList.push(...filteredData);
        // return filteredData;
      }
      console.log(`Final-List: ${JSON.stringify(searchList)}`);
      const uniqueOutput = Object.values(
        searchList.reduce((acc, obj) => {
          acc[obj.key] = obj;
          return acc;
        }, {})
      );
      return uniqueOutput;
    } else {
      return uniqueArray;
    }
  };

  return (
    <div>
      <SearchBar onSearch={updateTerms} />
      {console.log(`Search Terms: ${filterTerms}`)}
      {console.log(`Image Objects: ${JSON.stringify(imageObjects)}`)}
      {console.log(`input: ${JSON.stringify(filterData(filterTerms))}`)}
      <ImgDownload ImageObjects={filterData(filterTerms)} />
      <header className="App-header">
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <div className="Gallery-img">
          <ImageTile ImageObjects={filterData(filterTerms)} />
        </div>
      </header>
    </div>
  );
};

export default Home;
