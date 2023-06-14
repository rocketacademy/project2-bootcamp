// File to contain 'Profile' items like edit and update name, profile picture, email address, bio, etc
import "../App.css";

export default function Profile(props) {
  return (
    <div>
      {" "}
      <div className="temporary-box">
        <h1>Profile Page</h1>
        {/* <h2>{uid}</h2> */}
        <br />
        <img src={props.profilePhotoURL} alt={props.profilePhotoURL} />
      </div>
    </div>
  );
}
