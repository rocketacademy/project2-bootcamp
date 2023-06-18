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
          <h1>Profile Page</h1>
          <br />
          {profilePhotoURL ? (
            <img src={profilePhotoURL} alt="user" />
          ) : (
            <>
              <img src={patchQuestionFillSvg} alt="user" />
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
