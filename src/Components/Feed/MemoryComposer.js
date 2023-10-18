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
import { push, ref, set, remove } from "firebase/database";

//-----------Components-----------//
import { ImageCarousel } from "./ImageCarousel";
import ContextHelper from "../Helpers/ContextHelper";
import Button from "../../Details/Button";

//-----------Media-----------//
import uploadimage from "../../Images/upload-image.png";

//Props Format: <Composer postContent = {post} />
export default function MemoryComposer({
  id,
  uploadMessage,
  uploadDate,
  uploadTags,
}) {
  const navigate = useNavigate();

  // Variables
  const DUMMY_USERID = ContextHelper("displayName");
  const DUMMY_PAIRID = ContextHelper("pairKey");

  const [formInfo, setFormInfo] = useState({
    key: id,
    postMessage: uploadMessage ? uploadMessage : "",
    date: uploadDate ? uploadDate : null,
    tags: uploadTags ? uploadTags : "",
    fileArray: [],
  });

  const [filePreviewArray, setFilePreviewArray] = useState([]);

  const textChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    setFormInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const selectChange = (e) => {
    const value = e.target.value;
    setFormInfo((prevState) => {
      const updatedTags = prevState.tags ? `${prevState.tags} ${value}` : value;
      return { ...prevState, tags: updatedTags };
    });
  };

  const imgChange = (e) => {
    setFormInfo((prevState) => {
      return { ...prevState, fileArray: Object.values(e.target.files) };
    });
    setFilePreviewArray(
      Object.values(e.target.files).map((file) => URL.createObjectURL(file)),
    );
  };

  const formattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const writeData = () => {
    const fileRefArray = [];
    sList(sRef(storage, `rooms/${DUMMY_PAIRID}/feedImages/`), null)
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
                  `rooms/${DUMMY_PAIRID}/feedImages/image${
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
        const messageListRef = ref(database, `rooms/${DUMMY_PAIRID}/feed`);
        push(messageListRef, {
          user: DUMMY_USERID,
          message: formInfo.postMessage,
          date: formattedDate(formInfo.date),
          files: urlArray,
          tags: formInfo.tags,
          comments: [],
        });
      })
      .then(() => {
        //reset form after submit
        setFormInfo({
          fileArray: [],
          postMessage: "",
          date: null,
          tags: "",
        });
        navigate("/memories");
      });
  };

  // Not needed as redirect
  // const closeComposerModal = () => {
  //   document.getElementById("composer").close();
  // };

  return (
    <div className="flex flex-col items-center justify-center">
      <ImageCarousel urlArray={filePreviewArray ? filePreviewArray : []} />
      <form className=" flex flex-col items-center justify-center">
        <label className="text-sm">
          <p>New Memory:</p>
        </label>
        <input
          type="text"
          id="postMessage"
          placeholder="Tell me about this memory!"
          onChange={(e) => {
            textChange(e);
          }}
          value={formInfo.postMessage}
          className="input my-1 w-[250px] bg-white text-sm"
        />
        <label className="text-sm">Main Tag:</label>
        <select
          className="select select-bordered mb-1 w-full max-w-xs bg-white"
          onChange={(e) => selectChange(e)}
        >
          <option disabled selected>
            Add a main tag
          </option>
          <option>milestone</option>
          <option>dates</option>
          <option>bucket-list</option>
        </select>
        <label className="text-sm">Add tags separated by spaces:</label>
        <input
          type="text"
          id="tags"
          placeholder="e.g. date travel bucket-list"
          onChange={(e) => {
            textChange(e);
          }}
          value={formInfo.tags}
          className="input mb-2 w-[250px] bg-white text-sm"
        />
        <p>Event End: {formattedDate(formInfo.date)}</p>
        <label
          htmlFor="upload-image"
          style={{ cursor: "pointer" }}
          className=" m-1 flex h-[48px] w-[170px] flex-row items-center justify-center
 rounded-lg bg-slate-300 px-2 text-[14px] font-semibold shadow-lg hover:translate-y-[-2px] hover:bg-slate-400"
        >
          <img
            src={uploadimage}
            alt="camera icon"
            className="h-[2em] translate-y-[1px]"
          />
          UPLOAD PHOTOS
        </label>
        <input
          type="file"
          id="upload-image"
          className="display: none"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            imgChange(e);
          }}
          multiple
        />
      </form>
      <Button
        label="Create Post!"
        handleClick={() => {
          writeData();
          // closeComposerModal();
        }}
      />
    </div>
  );
}
