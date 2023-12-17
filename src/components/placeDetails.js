import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { TripContext } from "../Provider/TripProvider.js";

const PlaceDetails = ({
  hiddenGemId,
  editorial_summary,
  formatted_address,
  name,
  photos,
  rating,
  types,
  clearState,
  likes,
  visits,
  saves,
  onCommentButtonClick,
  onButtonChange,
}) => {
  const { user } = useContext(UserContext);
  const {
    setShowPastTrips,
    setShowNewTrip,
    setActiveButton,
    addedGems,
    setAddedGems,
    currentHiddenGemId,
    setCurrentHiddenGemId,
  } = useContext(TripContext);

  const navigate = useNavigate();

  // const [userLike, setUserLike] = useState(null);
  // const [userVisit, setUserVisit] = useState(null);
  // const [userSave, setUserSave] = useState(null);

  const calculateCount = (correspondObject) => {
    let count = 0;
    if (correspondObject) {
      Object.values(correspondObject).forEach((bool) => {
        if (bool) {
          count++;
        }
      });
      return count;
    }
  };

  const userSelfLike = () => {
    if (likes) {
      if (likes[user.uid]) {
        return likes[user.uid];
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const onPastTripsClick = () => {
    setShowNewTrip(false);
    setShowPastTrips(true);
    setActiveButton(3);
    setCurrentHiddenGemId(hiddenGemId)
    navigate("/Create");
  };

  const onNewTripsClick = () => {
    setCurrentHiddenGemId(hiddenGemId)
    setAddedGems([hiddenGemId])
    setShowNewTrip(true);
    setShowPastTrips(false);
    setActiveButton(1);
    navigate("/Create");
  };

  const userSelfVisit = () => {
    if (visits) {
      if (visits[user.uid]) {
        return visits[user.uid];
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const userSelfSave = () => {
    if (saves) {
      if (saves[user.uid]) {
        return saves[user.uid];
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const renderPhoto = () => {
    if (photos) {
      return photos.map((photo) => {
        return (
          <div 
            className="carousel-item"
            key={photo}
          >
            <button
              name="photos"
              className="rounded-box bg-slate-200 h-52"
              onClick={() => {
                // onNewTripsClick();
              }}
            >
              <img
              className="h-52"
                src={photo}
                alt="sitePhoto"
              />
            </button>
          </div>
        )
      })
    }
  }

  // useEffect(() => {
  //   console.log(user);
  //   if (user) {
  //     if (likes) {
  //       if (likes[user.uid]){
  //         setUserLike(likes[user.uid]);
  //       } else {
  //         setUserLike(false);
  //       }
  //     } else {
  //       setUserLike(false);
  //     }

  //     if (visits) {
  //       if (visits[user.uid]){
  //         setUserVisit(visits[user.uid]);
  //       } else {
  //         setUserVisit(false);
  //       }
  //     } else {
  //       setUserVisit(false);
  //     }

  //     if (saves) {
  //       if (saves[user.uid] !== undefined){
  //         setUserSave(saves[user.uid]);
  //       } else {
  //         setUserSave(false);
  //       }
  //     } else {
  //       setUserSave(false);
  //     }
  //   }
  // }, [user, likes, visits, saves])

  return (
    <dialog id="placeDetailsModal" className="modal modal-bottom">
      <div className="modal-box">
        <div className="flex flex-col justify-center text-center content-center gap-3">
          {/* Place Details */}
          <div className="flex justify-between text-center content-center gap-4">
            <div className="flex flex-col justify-between  text-left content-center gap-1">
              <h1 className="font-bold text-xl">{name}</h1>
              <h4>Rating: {rating}</h4>
              {editorial_summary ? (
                <p className="text-xs">{editorial_summary.overview}</p>
              ) : (
                ""
              )}
            </div>
            <div>
              <h1>{" "}</h1>
            </div>
          </div>

          {/* Carousell */}
          <div className="carousel carousel-center max-w-md space-x-2 h-auto bg-white rounded-box">
            {renderPhoto()}
          </div>

          {/* Buttons Row */}
          <div className="flex justify-between text-center content-center">

            <div className="flex justify-between text-center content-center">
              
              {/* Like Button */}
              {userSelfLike() ? (
                <form name="true" id="like" onSubmit={(e) => onButtonChange(e)}>
                  <button
                    type="submit"
                    className="btn-sm btn-ghost text-xl pl-0 pr-2"
                  >
                    <i className="fi fi-sr-heart"></i>
                  </button>
                </form>
              ) : (
                <form
                  name="false"
                  id="like"
                  onSubmit={(e) => onButtonChange(e)}
                >
                  <button
                    type="submit"
                    className=" btn-sm btn-ghost text-xl pl-0 pr-2"
                  >
                    <i className="fi fi-rr-heart"></i>
                  </button>
                </form>
              )}
              {/* Comment Button */}
              <button
                id="comment"
                className="btn-sm btn-ghost text-xl"
                onClick={() => onCommentButtonClick()}
              >
                <i className="fi fi-rr-comment-dots"></i>
              </button>
              {/* Send Button */}
              <button
                id="send"
                className="btn-sm btn-ghost text-xl"
                onClick={() => {}}
              >
                <i className="fi fi-rr-paper-plane"></i>
              </button>
              {/* Visit Button */}
              {userSelfVisit() ? (
                <form
                  name="true"
                  id="visit"
                  onSubmit={(e) => onButtonChange(e)}
                >
                  <button type="submit" className="btn-sm btn-ghost text-xl">
                    <i className="fi fi-sr-check-circle"></i>
                  </button>
                </form>
              ) : (
                <form
                  name="false"
                  id="visit"
                  onSubmit={(e) => onButtonChange(e)}
                >
                  <button type="submit" className="btn-sm btn-ghost text-xl">
                    <i className="fi fi-rr-check-circle"></i>
                  </button>
                </form>
              )}
            </div>
            {/* Save Button */}
            {userSelfSave() ? (
              <form name="true" id="save" onSubmit={(e) => onButtonChange(e)}>
                <button
                  type="submit"
                  className="btn-sm btn-ghost text-xl pl-2 pr-0"
                >
                  <i className="fi fi-sr-bookmark"></i>
                </button>
              </form>
            ) : (
              <form name="false" id="save" onSubmit={(e) => onButtonChange(e)}>
                <button
                  type="submit"
                  className="btn-sm btn-ghost text-xl pl-2 pr-0"
                >
                  <i className="fi fi-rr-bookmark"></i>
                </button>
              </form>
            )}
          </div>
          {/* Like & Visited Count Row */}
          <p className="text-left text-xs font-bold">
            {calculateCount(likes) > 0 ? `${calculateCount(likes)} likes` : ""}{" "}
            {calculateCount(visits) > 0
              ? ` ${calculateCount(visits)} visited`
              : ""}
          </p>
          {/* Carousell */}
          <div className="carousel carousel-center max-w-md space-x-2 h-auto bg-white rounded-box">
            <div className="carousel-item">
              <button
                name="createNewTrip"
                className="rounded-box bg-slate-200 h-16 "
                onClick={() => {
                  onNewTripsClick();
                }}
              >
                <div className="flex p-4 justify-center text-center content-center gap-2">
                  <i className="fi fi-rr-plus content-center"></i>
                  <p className="font-bold">Create A Trip ?</p>
                </div>
              </button>
            </div>
            <div className="carousel-item">
              <button
                name="addToExistingTrip"
                className="rounded-box bg-slate-200 h-16"
                onClick={() => {
                  onPastTripsClick();
                }}
              >
                <div className="flex flex-col p-4 justify-center text-left content-center">
                  <p className="font-bold">Add to Created Trips</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <form
        method="dialog"
        className="modal-backdrop"
        onSubmit={() => clearState()}
      >
        <button type="submit">close</button>
      </form>
    </dialog>
  );
};

export default PlaceDetails;
