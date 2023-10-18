//NOT IN USE - replaced by MultiFileComposer
//NOT IN USE - replaced by MultiFileComposer
//NOT IN USE - replaced by MultiFileComposer

import { useState } from "react";
import { database, storage } from "../../firebase/firebase";
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  list as sList,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";

const DUMMY_USERID = "dummyuser"; // to use these as subs
const DUMMY_PAIRID = "dummypair"; // to use these as subs

//<Composer postContent={null} closeComposerModal = {closeComposerModal}/>
export function Composer(props) {
  const [formInfo, setFormInfo] = useState({
    file: null, //props.postContent ? 'props.postContent.val.file' :
    postMessage: props.postContent ? props.postContent.val.message : "",
    date: props.postContent ? props.postContent.val.date : null,
    tags: props.postContent ? props.postContent.val.tags : "",
  });
  const [filePreview, setFilePreview] = useState(
    props.postContent ? props.postContent.val.file : "",
  );

  const textChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    console.log(formInfo.file);
    setFormInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const imgChange = (e) => {
    console.log(props.postContent);
    setFormInfo((prevState) => {
      return { ...prevState, file: e.target.files[0] };
    });
    if (props.postContent && e.target.files.length === 0) {
      console.log("original image");
      setFilePreview(props.postContent.val.file);
    } else {
      setFilePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const writeData = async (event) => {
    event.preventDefault();
    console.log(formInfo.file);
    let fileRef = null;
    sList(sRef(storage, `rooms/${DUMMY_PAIRID}/feedImages/`), null)
      .then((result) => {
        fileRef = sRef(
          storage,
          `rooms/${DUMMY_PAIRID}/feedImages/image${result.items.length}`,
        );
        if (formInfo.file) {
          return uploadBytes(fileRef, formInfo.file);
        } else return null;
      })
      .then(() => {
        if (formInfo.file) {
          return getDownloadURL(fileRef);
        } else return null;
      })
      .then((url) => {
        // if post was given, take the ref and set it; else take the parent folder and push it
        console.log(url);
        if (props.postContent !== null) {
          const messageListRef = ref(
            database,
            `rooms/${DUMMY_PAIRID}/feed/${props.postContent.key}`,
          );
          set(messageListRef, {
            user: DUMMY_USERID,
            message: formInfo.postMessage,
            date: props.postContent.val.date,
            file: url ? url : props.postContent.val.file, //just take url from new file for now - need to figure out how to delete the old file
            tags: formInfo.tags,
            comments: props.postContent.val.comments
              ? props.postContent.val.comments
              : null,
          });
        } else {
          const messageListRef = ref(database, `rooms/${DUMMY_PAIRID}/feed`);
          push(messageListRef, {
            user: DUMMY_USERID,
            message: formInfo.postMessage,
            date: `${new Date().toLocaleString()}`,
            file: url,
            tags: formInfo.tags,
            comments: [],
          });
        }
      })
      .then(() => {
        //reset form after submit
        setFormInfo({
          file: null,
          postMessage: "",
          date: null,
          tags: "",
        });
        setFilePreview("");
        props.closeComposerModal();
      });
  };

  return (
    <div className="w-1/5">
      <img src={filePreview} />
      <form
        onSubmit={writeData}
        className="flex flex-col justify-center bg-yellow-300"
      >
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
          className="display: none"
          accept="image/*"
          // style= {{ display: "none"}}
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
