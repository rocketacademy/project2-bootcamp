import { useState, useEffect } from "react";
import { database } from "../../firebase/firebase";
import { onChildAdded, push, ref } from "firebase/database";
import { MultiFileComposer } from "./MultiFileComposer.js";
import { ImageCarousel } from "./ImageCarousel";
import ContextHelper from "../Helpers/ContextHelper";

export function Post(props) {
  const DUMMY_USERID = "dummyuser"; // to use these as subs
  const DUMMY_PAIRID = ContextHelper("pairKey"); // to use these as subs
  console.log(props.postContent);
  const [commentInput, setCommentInput] = useState({});
  const [commentList, setCommentList] = useState([]);
  const DB_FEED_KEY = `feed`;

  useEffect(() => {
    // whenever app renders
    const commentRef = ref(
      database,
      `rooms/${DUMMY_PAIRID}/${DB_FEED_KEY}/${props.postContent.key}/comments`,
    ); //setup reference
    onChildAdded(commentRef, (data) => {
      //setup listener
      setCommentList((prevComments) => [
        ...prevComments,
        { key: data.key, val: data.val() },
      ]);
    });
  }, [DB_FEED_KEY, DUMMY_PAIRID, props.postContent.key]);

  const writeComment = () => {
    const commentRef = ref(
      database,
      `rooms/${DUMMY_PAIRID}/${DB_FEED_KEY}/${props.postContent.key}/comments`,
    );
    push(commentRef, commentInput).then(() => {
      //reset form after submit
      setCommentInput({
        commentingUser: DUMMY_USERID,
        commentText: "",
      });
    });
  };

  const commentListItems = commentList.map((comment) => (
    <div
      className=" m-1 border border-black bg-green-300 p-1"
      key={comment.key}
    >
      {comment.val.commentingUser} : {comment.val.commentText}
    </div>
  ));

  return (
    <div
      className=" max-h-1/5 m-2 border border-black bg-text"
      key={props.postContent.key}
    >
      {/* {props.postContent.val.file ? <img src={props.postContent.val.file} alt='Post message' /> : null} */}
      {props.postContent.val.files ? (
        <ImageCarousel
          urlArray={
            props.postContent.val.files ? props.postContent.val.files : []
          }
        />
      ) : null}
      {props.postContent.val.message}
      <br />
      <div className="flex justify-between">
        <p className="font-bold">-{props.postContent.val.user} </p>
        <p>{props.postContent.val.date}</p>
      </div>
      <div className="flex flex-row flex-wrap justify-center">
        Tags:{" "}
        {props.postContent.val.tags.split(" ").map((tag) => (
          <p className="mx-1 rounded border-2 border-solid border-black bg-blue-300">
            {tag}
          </p>
        ))}
      </div>
      {commentListItems}
      <div className="flex justify-between">
        <button
          onClick={() => document.getElementById("commentComposer").showModal()}
          className="mx-1 max-h-6 w-1/5 bg-blue-300 text-left"
        >
          Comment
        </button>
        <dialog id="commentComposer" className="modal ">
          <div className="modal-box bg-window">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div>
              <input // comment modal rather than a comment input, so one comment button and one edit
                type="text"
                placeholder="Comment?"
                onChange={(e) => {
                  setCommentInput({
                    commentingUser: DUMMY_USERID,
                    commentText: e.target.value,
                  });
                }}
                value={commentInput.commentText}
                className="p-1 text-black"
              />
              <button
                onClick={writeComment}
                className="border-2 border-black bg-window p-1"
              >
                Post
              </button>
            </div>
          </div>
        </dialog>
        <button
          onClick={() =>
            document
              .getElementById(`editPost-${props.postContent.key}`)
              .showModal()
          }
        >
          {" "}
          Edit{" "}
        </button>
      </div>
      <dialog id={`editPost-${props.postContent.key}`} className="modal">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
        </form>
        {console.log(
          props.postContent.val.files ? props.postContent.val.files : "foo",
        )}

        <MultiFileComposer
          key={`composer-${props.postContent.key}`}
          postContent={props.postContent}
        />
      </dialog>
    </div>
  );
}
