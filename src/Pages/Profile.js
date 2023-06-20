// File to contain 'Profile' items like edit and update name, profile picture, email address, bio, etc
import "../App.css";
import patchQuestionFillSvg from "../Icons/patch-question-fill.svg";

export default function Profile({ userData, profilePhotoURL }) {
  const userInfo = Object.entries(userData).map(([key, value]) => (
    <div key={key}>
      <span>{key}: </span>
      <span>{value}</span>
    </div>
  ));

  return (
    <div>
      {" "}
      <div className="temporary-box">
        <div>
          {profilePhotoURL ? (
            <img src={profilePhotoURL} alt="user" className="profile-picture" />
          ) : (
            <>
              <img
                src={patchQuestionFillSvg}
                alt="user"
                className="profile-picture"
              />
              <br />
              <h6>-No image-</h6>
            </>
          )}
          <br />
          <h1>{userData.displayName}</h1>
          {userInfo}
        </div>
      </div>
    </div>
  );
}
