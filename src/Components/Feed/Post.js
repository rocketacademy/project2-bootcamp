// Outstanding bugs - Comments not working properly -> All comments being pushed to a single key

//-----------React-----------//
import { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../../firebase/firebase";
import { onChildAdded, push, ref } from "firebase/database";

//-----------Components-----------//
import { MultiFileComposer } from "./MultiFileComposer.js";
import { ImageCarousel } from "./ImageCarousel";
import ContextHelper from "../Helpers/ContextHelper";
import Button from "../../Details/Button";

export function Post(props) {
  const DUMMY_USERID = ContextHelper("displayName");
  const DUMMY_PAIRID = ContextHelper("pairKey");

  const [commentInput, setCommentInput] = useState({});
  const [commentList, setCommentList] = useState([]);

  const DB_FEED_KEY = `feed`;

  // Pull comments data
  useEffect(() => {
    const commentRef = ref(
      database,
      `rooms/${DUMMY_PAIRID}/${DB_FEED_KEY}/${props.postContent.key}/comments`,
    );
    onChildAdded(commentRef, (data) => {
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
      className=" my-1 rounded-lg border bg-background p-1"
      key={comment.key}
    >
      <span className="font-bold">{comment.val.commentingUser}</span> :{" "}
      {comment.val.commentText}
    </div>
  ));

  return (
    <div
      className=" w-[300px] rounded-xl bg-window p-3 shadow-xl"
      key={props.postContent.key}
    >
      {props.postContent.val.files ? (
        <ImageCarousel
          urlArray={
            props.postContent.val.files ? props.postContent.val.files : []
          }
        />
      ) : null}
      {/* Username and caption message */}
      <header className="flex flex-row">
        <p className="text-sm font-bold">{props.postContent.val.user} </p>
        <p className="mx-2  text-sm">{props.postContent.val.message}</p>
      </header>
      <section className="">
        <div className="m-1 flex flex-row text-xs">
          Tags:
          {props.postContent.val.tags.split(" ").map((tag) => (
            <p className="mx-1 rounded bg-text px-[3px]">{tag}</p>
          ))}
        </div>{" "}
        <p className="text-xs">{props.postContent.val.date}</p>
      </section>
      <div className="flex justify-between"></div>

      <figure className="text-xs">{commentListItems}</figure>
      <div className="flex justify-between">
        <button
          onClick={() => document.getElementById("commentComposer").showModal()}
          className="mt-1 max-h-6 rounded-lg bg-background px-2 text-left text-xs"
        >
          Comment
        </button>
        <dialog id="commentComposer" className="modal ">
          <div className="modal-box bg-background">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h1>Share your thoughts!</h1>
            <div>
              <input // comment modal rather than a comment input, so one comment button and one edit
                type="text"
                placeholder="Add Comments"
                onChange={(e) => {
                  setCommentInput({
                    commentingUser: DUMMY_USERID,
                    commentText: e.target.value,
                  });
                }}
                value={commentInput.commentText}
                className="input bg-white text-black"
              />
              <Button label="post" handleClick={writeComment} add="w-[100px]" />
            </div>
          </div>
        </dialog>
        <button
          className="text-sm text-slate-500 hover:text-slate-700"
          onClick={() =>
            document
              .getElementById(`editPost-${props.postContent.key}`)
              .showModal()
          }
        >
          Edit
        </button>
      </div>
      <dialog id={`editPost-${props.postContent.key}`} className="modal">
        <div className="modal-box bg-background">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <MultiFileComposer
            key={`composer-${props.postContent.key}`}
            postContent={props.postContent}
          />
        </div>
      </dialog>
    </div>
  );
}
