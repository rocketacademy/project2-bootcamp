// NOT IN USE...yet

import { useState } from "react";
import { database, storage } from "../../firebase/firebase";
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  list as sList,
} from "firebase/storage";
import { push, ref, set, remove } from "firebase/database";
import {useNavigate} from 'react-router-dom'
import {ImageCarousel} from './ImageCarousel';

const DUMMY_USERID = "dummyuser"; // to use these as subs
const DUMMY_PAIRID = "dummypair"; // to use these as subs

//<Composer postContent = {post} />
export function MultiFileComposer(props) {
  const [formInfo, setFormInfo] = useState({
    postMessage: props.postContent ? props.postContent.val.message : "",
    date: props.postContent ? props.postContent.val.date : null,
    tags: props.postContent ? props.postContent.val.tags : "",
    fileArray: [],
  });
  const [filePreviewArray, setFilePreviewArray] = useState(props.postContent ? props.postContent.val.fileArray : [])
  const navigate = useNavigate()

  const textChange = (e) => {
    console.log(props) // why does this give null even when editing?
    const name = e.target.id;
    const value = e.target.value;
    setFormInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const imgChange = (e) => {
    setFormInfo((prevState) => {
      return { ...prevState, fileArray: Object.values(e.target.files)};
    });
    if (props.postContent && e.target.files.length === 0) {
      setFilePreviewArray(props.postContent.val.fileArray)
    } else {
      console.log(Object.values(e.target.files))
      setFilePreviewArray(Object.values(e.target.files).map((file)=>URL.createObjectURL(file)))
    }
  };

  const writeData = (event) => {
    event.preventDefault();
    const fileRefArray = [];
    sList(sRef(storage, `rooms/${DUMMY_PAIRID}/feedImages/`), null)
      .then((result) => {
        if (formInfo.fileArray.length === 0) {
          return [];
        } else {
          return Promise.all(//array of promises - map array of images to array of promises
            formInfo.fileArray.map(async (file, index) => {
              fileRefArray.push(sRef(storage, `rooms/${DUMMY_PAIRID}/feedImages/image${result.items.length + index}`))
              return uploadBytes(fileRefArray[index], file)
            })
          )
        }
      })
      .then(() => Promise.all(fileRefArray.map((fileRef)=>getDownloadURL(fileRef))))
      .then((urlArray) => {
        // if post was given, take the ref and set it; else take the parent folder and push it
        if (props.postContent !== null) {
            const messageListRef = ref(database, `rooms/${DUMMY_PAIRID}/feed/${props.postContent.key}`)
            set(messageListRef, {
                user: DUMMY_USERID,
                message: formInfo.postMessage,
                date: props.postContent.val.date,//this is the original value - can i just omit this line?
                files: urlArray.length !== 0 ? urlArray : props.postContent.val.fileArray, //just take url from new file for now - need to figure out how to delete the old file
                tags: formInfo.tags,
                comments: props.postContent.val.comments ?  props.postContent.val.comments : null
            })
        }
        else {
        const messageListRef = ref(database, `rooms/${DUMMY_PAIRID}/feed`);
        push(messageListRef, {
          user: DUMMY_USERID,
          message: formInfo.postMessage,
          date: `${new Date().toLocaleString()}`,
          files: urlArray,
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
        props.closeComposerModal()
        navigate('../memories')
      });
  };

  const handleDelete=(e)=>{
    console.log(props.postContent)
    const postRef = ref(database, `rooms/${DUMMY_PAIRID}/feed/${props.postContent.key}`);
    remove(postRef)
  }

  return (
    <div className = 'w-4/5'>
    <ImageCarousel urlArray = {filePreviewArray ? filePreviewArray : []} />
      <form onSubmit={writeData} className="flex flex-col justify-center bg-window">
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
          accept='image/*'
          onChange={(e) => {
            imgChange(e);
          }}
          multiple
        />
        <br />
        <input type="submit" value="Send" />
        <br />
        {props.postContent ? <button id='deletePost' onClick={(e) => handleDelete(e)}>
          Delete Post
        </button>
          : null}
      </form>
    </div>
  );
}
