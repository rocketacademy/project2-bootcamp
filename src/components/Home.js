import React,{useEffect,useState} from "react";
import ImageTile from "./ImageTile";
import SearchBar from "./SearchBar";
import ImgDownload from "./ImgDownload";

//Firebase - Pull data from server
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database} from "../firebase";

const IMAGEOBJECT_FOLDER_NAME = "imageObjects";

const Home = () => {
  const [imageObjects, setImageObjects] = useState([]);

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
        setImageObjects((preImageObjects) => 
          // Store message key so we can use it as a key in our list items when rendering messages
          [...preImageObjects, 
            { key: data.key,
              imgurl: data.val().imgurl, 
              tagsarray: data.val().tagsarray,
              email:data.val().email,
              name:data.val().name,
              pass:data.val().pass,
            }], //key-value pair
        )});
    };
    
  },[]);

  // console.log(imageObjects)
  const itemData = imageObjects.map(({key,imgurl}) => ({key:key,img:imgurl,title:null}));
  

    return (
      <div>
        <SearchBar />
        <ImgDownload ImageObjects={itemData} />
        <header className="App-header">
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <div className="Gallery-img">
            <ImageTile ImageObjects={itemData} />
          </div>
        </header>
      </div>
    );
  }

export default Home;
