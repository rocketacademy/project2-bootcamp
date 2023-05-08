//----------- React -----------//

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

//---------- Firebase ----------//

import { database } from "../../firebase";
import { get, ref } from "firebase/database";

//---------- Components ----------//

import List from "../../Components/List/List";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "../ProfileScreen/ProfileScreen.css";

//------------------------------//

const ProfileUserScreen = () => {
  const { link } = useParams();
  const { DB_USERS_KEY } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [tab, setTab] = useState("top-ten");

  useEffect(() => {
    const DB_USER_SEARCH_KEY = DB_USERS_KEY + "/" + link;
    const userRef = ref(database, DB_USER_SEARCH_KEY);
    get(userRef).then((data) => {
      if (data.exists()) {
        setUserData(data.val());
      } else {
        setUserData("Error");
      }
    });
  }, [DB_USERS_KEY, link]);

  const handleToggle = (e) => {
    setTab(e.target.id);
  };

  return (
    <div className="contents">
      {userData ? (
        <>
          <HeaderBar title={userData.name} userData={userData} button={false} />
          <div id="profile-lists">
            <div id="profile-lists-tabs">
              <button
                onClick={handleToggle}
                id="top-ten"
                className={tab === "top-ten" ? "active-tab" : ""}
              >
                Top Ten
              </button>
              <button
                onClick={handleToggle}
                id="wishlist"
                className={tab === "wishlist" ? "active-tab" : ""}
              >
                Wishlist
              </button>
            </div>
            {tab === "top-ten" ? (
              <List
                list={userData.topten}
                listOrder={userData.toptenorder}
                id="topten"
              />
            ) : (
              <List
                list={userData.wishlist}
                listOrder={userData.wishlistorder}
                id="wishlist"
              />
            )}
          </div>
        </>
      ) : (
        <h1>Loading</h1>
      )}

      <NavBar />
    </div>
  );
};

export default ProfileUserScreen;
