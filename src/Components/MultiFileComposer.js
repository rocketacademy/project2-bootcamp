// NOT IN USE...yet

import { useState } from "react";
import { database, storage } from "../firebase/firebase";
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  list as sList,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";

const DUMMY_USERID = "dummyuser"; // to use these as subs
const DUMMY_PAIRID = "dummypair"; // to use these as subs

//<Composer postContent = {post} />
export function Composer(props) {
  const [formInfo, setFormInfo] = useState({
    postMessage: props.postContent ? props.postContent.val.message : "",
    date: props.postContent ? props.postContent.val.date : null,
    tags: props.postContent ? props.postContent.val.tags : "",
    fileArray: props.postContent ? props.postContent.val.fileArray : null,
  });
  const [filePreviewArray, setFilePreviewArray] = useState(props.postContent ? props.postContent.val.fileArray : [])

  const textChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    setFormInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const imgChange = (e) => {
    setFormInfo((prevState) => {
      return { ...prevState, fileArray: e.target.files};
    });
    if (props.postContent && e.target.files.length === 0) {
      setFilePreviewArray(props.postContent.val.fileArray)
    } else {
      setFilePreviewArray(e.target.files.map((file)=>URL.createObjectURL(file)))
    }
  };

  const writeData = async (event) => {
    event.preventDefault();
    let fileRef = null;
    sList(sRef(storage, `${DUMMY_PAIRID}/feedImages/`), null)
      .then((result) => {
        fileRef = sRef(
          storage,
          `${DUMMY_PAIRID}/feedImages/image${result.items.length}`,
        );
        return Promise.all(//array of promises - map array of images to array of promises
        formInfo.fileArray.map(async (file, index)=>{
            fileRef = sRef(storage, `${DUMMY_PAIRID}/feedImages/image${result.items.length+index}`)
           return uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef))
        })     
        ) 
      })
      .then((urlArray) => {
        // if post was given, take the ref and set it; else take the parent folder and push it
        if (props.postContent !== null) {
            const messageListRef = ref(database, `${DUMMY_PAIRID}/feed/${props.postContent.key}`)
            set(messageListRef, {
                user: DUMMY_USERID,
                message: formInfo.postMessage,
                date: props.postContent.val.date,//this is the original value - can i just omit this line?
                fileArray: urlArray, //just take url from new file for now - need to figure out how to delete the old file
                tags: formInfo.tags,
                comments: props.postContent.val.comments
            })
        }
        else {
        const messageListRef = ref(database, `${DUMMY_PAIRID}/feed`);
        push(messageListRef, {
          user: DUMMY_USERID,
          message: formInfo.postMessage,
          date: `${new Date().toLocaleString()}`,
          file: urlArray,
          tags: formInfo.tags,
          comments: [],
        });
       }
      })
      .then(() => {
        //reset form after submit
        setFormInfo({
          fileArray: [],
          postMessage: "",
          date: null,
          tags: "",
        });
      });
  };

const filePreviews = filePreviewArray.map((fileURL, index, arr)=> { //account for case of 1 file
    const prevIndex = (index === 0 ? arr.length-1 : index-1)
    const nextIndex = (index === arr.length ? 0 : index+1)
    return (
    <div id={`slide${index}`} className="carousel-item relative w-full">
    <img src="/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href={`slide${prevIndex}`} className="btn btn-circle">❮</a> 
      <a href={`slide${nextIndex}`} className="btn btn-circle">❯</a>
    </div>
  </div> 
    )  
})

  return (
    <div className = 'w-1/5'>
    <img src = {filePreview} />
      <form onSubmit={writeData} className="flex flex-col justify-center bg-yellow-300">
        <input
          type="text"
          id="postMessage"
          placeholder="enter caption here:"
          onChange={(e) => {
            textChange(e);
          }}
          value={formInfo.postMessage}
          className="text-black"
        />
        <br />
        <input
          type="text"
          id="tags"
          placeholder="enter tags separated by spaces:"
          onChange={(e) => {
            textChange(e);
          }}
          value={formInfo.tags}
          className="text-black"
        />
        <br />
        <input
          type="file"
          className = 'display: none'
          onChange={(e) => {
            imgChange(e);
          }}
        />
        <br />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
