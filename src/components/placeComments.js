import React, { useContext, useState} from "react";
import { UserContext } from "../App";

const PlaceComments = ({
  hiddenGemId,
  hiddenGemObject,
  hiddenGemSelfAddOnDataObject,
  commentText,
  onBackButtonClick,
  onCommentBoxChange,
  handleCommentSubmit,
}) => {
  const { user } = useContext(UserContext);

  // const [userComments, setUserComments] = useState(null);
  const [placeName, setPlaceName] = useState(null);

  const displayPostedDate = (time) => {
    let postedTime = new Date(time);
    let curentTime = new Date();
    let timeDifference = curentTime - postedTime;
    let display;

    // Display years
    if (timeDifference / 1000 / 60 / 60 / 24 / 7 / 52 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60 / 24 / 7 / 4) + "y";
      // Display weeks
    } else if (timeDifference / 1000 / 60 / 60 / 24 / 7 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60 / 24 / 7) + "w";
      // Display days
    } else if (timeDifference / 1000 / 60 / 60 / 24 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60 / 24) + "d";
      // Display hours
    } else if (timeDifference / 1000 / 60 / 60 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60) + "h";
      // Display minutes
    } else if (timeDifference / 1000 / 60 > 1) {
      display = parseInt(timeDifference / 1000 / 60) + "m";
      // Display now
    } else {
      display = "now";
    }

    return display;
  };

  const commentsList = () => {
    if (hiddenGemSelfAddOnDataObject) {
      if (hiddenGemSelfAddOnDataObject.comments) {
        let commentsKey = Object.keys(hiddenGemSelfAddOnDataObject.comments);
        if (commentsKey.length > 0) {
          return commentsKey.map((key) => {
            return (
              <ul className="list-none text-left text-sm" key={key}>
                <li>
                  <div>
                    <h3 className="font-bold">
                      {hiddenGemSelfAddOnDataObject.comments[key].userName} <span className="text-slate-400">{displayPostedDate(hiddenGemSelfAddOnDataObject.comments[key].commentDate)}</span>
                    </h3>
                    <p>
                      {hiddenGemSelfAddOnDataObject.comments[key].commentText}
                    </p>
                  </div>
                </li>
              </ul>
            );
          });
        };
      };
    }
  };

  useState(() => {
    if (hiddenGemObject) {
      setPlaceName(hiddenGemObject.name)
    }
  },[hiddenGemObject])

  // useState(() => {
  //   if (hiddenGemSelfAddOnDataObject) {
  //     if (hiddenGemSelfAddOnDataObject.comments) {
  //       let commentsKey = Object.keys(hiddenGemSelfAddOnDataObject.comments);
  //       if (commentsKey.length > 0) {
  //         setUserComments(commentsKey.map((key) => {
  //           return (
  //             <ul className="list-none text-left text-sm" key={key}>
  //               <li>
  //                 <div>
  //                   <h3 className="font-bold">
  //                     {hiddenGemSelfAddOnDataObject.comments[key].userName} <span className="text-slate-400">{displayPostedDate(hiddenGemSelfAddOnDataObject.comments[key].commentDate)}</span>
  //                   </h3>
  //                   <p>
  //                     {hiddenGemSelfAddOnDataObject.comments[key].commentText}
  //                   </p>
  //                 </div>
  //               </li>
  //             </ul>
  //           );
  //         }))
  //       };
  //     }
  //   };
  // }, [hiddenGemSelfAddOnDataObject])

  return (
    <dialog id="placeDetailsModal" className="modal modal-bottom">
      <div className="modal-box">
        <div className="flex justify-between text-center content-center p-2">
          <button
            onClick={() => onBackButtonClick()}
          >
            <i className="fi fi-rr-angle-left"></i>
          </button>
          <h1 className="font-bold text-sm">{placeName}</h1>
          <i className="fi fi-rr-info"></i>
        </div>
        <hr />
        <br />
        <div className="flex flex-col justify-center text-left content-center gap-3">
          {/* Comment List */}
          {commentsList() ? 
            commentsList()
            : (
            <div className="flex flex-col justify-center text-center content-center">
              <i className="fi fi-rr-comment-minus"></i>
              <p>No comments</p>
            </div>
          )}
          <form
            onSubmit={(e) => handleCommentSubmit(e)}
            className="flex items-center justify-between"
          >
            <input
              name="commentText"
              id={hiddenGemId}
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => onCommentBoxChange(e)}
              value={commentText}
              className="input input-sm w-full max-w-xs"
            />
            <input
              className=" btn btn-ghost btn-xs text-slate-400"
              type="submit"
            />
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default PlaceComments;
