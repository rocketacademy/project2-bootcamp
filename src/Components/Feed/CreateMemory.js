//-----------React-----------//
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//-----------Firebase-----------//
import { database, storage } from "../../firebase/firebase";
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  list as sList,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";
//-----------Components-----------//
import { ImageCarousel } from "./ImageCarousel";
import ContextHelper from "../Helpers/ContextHelper";

const CreateMemory = ({ details }) => {
  const navigate = useNavigate();
  const pairKey = ContextHelper("pairKey");
  const email = ContextHelper("email");

  const closeComposerModal = () => {
    const modal = document.getElementById("composer");
    modal.close();
  };

  // If details not added = Null
  const [formInfo, setFormInfo] = useState({
    message: details ? details.message : "",
    tags: details ? details.tags : "",
    date: details ? details.date : "",
    fileArray: [],
  });

  // Contain file preview image
  const [filePreviewArray, setFilePreviewArray] = useState([]);

  const textChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    setFormInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const imgChange = (e) => {
    const selectedFiles = Object.values(e.target.files);

    // Update form info with the selected files
    setFormInfo((prevState) => ({
      ...prevState,
      fileArray: selectedFiles,
    }));

    // Generate file previews for the selected files
    const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviewArray(filePreviews);
  };

  const writeData = () => {
    const fileRefArray = [];
    sList(sRef(storage, `rooms/${pairKey}/feedImages/`), null)
      .then((result) => {
        if (formInfo.fileArray.length === 0) {
          return [];
        } else {
          return Promise.all(
            //array of promises - map array of images to array of promises
            formInfo.fileArray.map(async (file, index) => {
              fileRefArray.push(
                sRef(
                  storage,
                  `rooms/${pairKey}/feedImages/image${
                    result.items.length + index
                  }`,
                ),
              );
              return uploadBytes(fileRefArray[index], file);
            }),
          );
        }
      })
      .then(() =>
        Promise.all(fileRefArray.map((fileRef) => getDownloadURL(fileRef))),
      )
      .then((urlArray) => {
        // if post was given, take the ref and set it; else take the parent folder and push it
        if (details !== null) {
          const messageListRef = ref(
            database,
            `rooms/${pairKey}/feed/${details.key}`,
          );
          set(messageListRef, {
            user: email,
            message: formInfo.postMessage,
            date: details.val.date, //this is the original value - can i just omit this line?
            files: urlArray.length !== 0 ? urlArray : details.val.fileArray, //just take url from new file for now - need to figure out how to delete the old file
            tags: formInfo.tags,
            comments: details.val.comments ? details.val.comments : null,
          });
        } else {
          const messageListRef = ref(database, `rooms/${pairKey}/feed`);
          push(messageListRef, {
            user: email,
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
        navigate("../memories");
      });
  };

  return (
    <>
      <button
        onClick={() => document.getElementById("composer").showModal()}
        className=" btn"
      >
        Create Memory
      </button>
      <dialog id="composer" className="modal">
        <div className="modal-box bg-window">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              X
            </button>
          </form>
          <ImageCarousel urlArray={filePreviewArray ? filePreviewArray : []} />
          <form className="flex flex-col justify-center ">
            <input
              type="text"
              id="message"
              placeholder="enter caption here:"
              onChange={(e) => {
                textChange(e);
              }}
              value={formInfo.message}
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
              onChange={(e) => {
                imgChange(e);
              }}
              multiple
            />
            <br />

            <br />
            {/* {details.postContent ? (
              <button id="deletePost" onClick={(e) => handleDelete(e)}>
                Delete Post
              </button>
            ) : null} */}
          </form>
          <button
            onClick={() => {
              writeData();
              closeComposerModal();
            }}
          >
            Send
          </button>
        </div>
      </dialog>
    </>
  );
};

export default CreateMemory;
