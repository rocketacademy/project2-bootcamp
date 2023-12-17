import React, { useState, useContext, useEffect, useRef } from "react";
import "../../App.css";
import Header from "../../components/header.js";
import Footer from "../../components/footer.js";
import { database } from "../../firebase.js";
import { UserContext } from "../../App.js";
import { CoordinatesContext } from "../../Provider/CoordinatesProvider";
import PlaceDetails from "../../components/placeDetails.js";
import PlaceComments from "../../components/placeComments.js";
import { GoogleMap, useLoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import "./explore.css";

import {
  ref,
  set, 
  push,
  onChildAdded,
  onChildRemoved,
  onValue,
} from "firebase/database";

/////////// DECALRE FIREBASE LIST NAME HERE ///////////
/////////// e.g. const DB_POSTS_KEY = "posts"; ///////////
const DB_HIDDENGEM_KEY = "hiddengems";
const DB_HIDDENGEM_SELF_ADDON_DATA_KEY = "hiddengems-selfaddondata";

export default function Explore() {
  /////////// DECALRE STATES HERE ///////////
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  return (
    <div className="App">
      <Header />
      <div
        className="flex flex-col h-screen justify-center text-center content-center overflow-auto"
        style={{ height: "calc(100% - 128px)" }}
      >
        {!isLoaded ? <div>Loading...</div> : <Map />}
      </div>
      <Footer />
    </div>
  );
}

function Map() {
  // User Object brought in via useContext();
  const { user } = useContext(UserContext);
  const { districtDetails, setDistrictDetails, gemRedirectDetails, setGemRedirectDetails } = useContext(CoordinatesContext);

  // Places Data
  const [ hiddenGem, setHiddenGem ] = useState({});
  const [ hiddenGemId, setHiddenGemId ] = useState(null);
  const [ hiddenGemSelfAddOnData, setHiddenGemSelfAddOnData] = useState({});
  const [ cardRender, setCardRender ] = useState("");
  const [ cardStage, setCardStage ] = useState(0);
  // For User's input interaction
  const [commentText, setCommentText] = useState("");
  const [likeButtonStatus, setLikeButtonStatus] = useState(null);
  const [visitButtonStatus, setVisitButtonStatus] = useState(null);
  const [saveButtonStatus, setSaveButtonStatus] = useState(null);
  // Maps Data
  const [ center, setCenter ] = useState({ lat: 22.41595185101585, lng: 114.14785397298424 });
  const [ map, setMap ] = useState(null);
  const [ zoom, setZoom ] = useState(9.8);
  // For handleZoomChanged
  const mapRef = React.createRef();
  // For transition
  // const mapContainerRef = useRef(null)

  const addMarkers = (clusterer) => {
    let hiddenGemKeys = Object.keys(hiddenGem);
    return hiddenGemKeys.map((key) => {
      const lat = hiddenGem[key].geometry.location.lat;
      const lng = hiddenGem[key].geometry.location.lng;
      const place_id = hiddenGem[key].place_id;

      return (
        <Marker
          position={{ lat: lat, lng: lng }}
          key={place_id}
          clusterer={clusterer}
          onClick={() => handleMarkerClick(lat, lng, place_id)}
        />
      )
    })
  };

  const handleMarkerClick = (lat, lng, place_id) => {
    console.log(place_id);
    console.log(lat);
    console.log(lng);
    let m_lat

    switch(zoom) {
      case 10:
        m_lat = lat - 0.240;
        break;
      case 11:
        m_lat = lat - 0.120;
        break;
      case 12:
        m_lat = lat - 0.060;
        break;
      case 13:
        m_lat = lat - 0.030;
        break;
      case 14:
        m_lat = lat - 0.015;
        break;
      case 15:
        m_lat = lat - 0.0075;
        break;
      case 16:
        m_lat = lat - 0.00375;
        break;
      case 17:
        m_lat = lat - 0.001875;
        break;
      case 18:
        m_lat = lat - 0.0009375;
        break;
      case 19:
        m_lat = lat - 0.00046875;
        break;
      case 20:
        m_lat = lat - 0.000234375;
        break;
      case 21:
        m_lat = lat - 0.0001171875;
        break;
      case 22:
        m_lat = lat - 0.00005859375;
        break;
      default:
        m_lat = lat;
    }
    setCenter({ lat: m_lat, lng: lng });
    setHiddenGemId(place_id);
    //console.log(hiddenGemId);

    //Set the "place_id" of the selected Marker to the local state "hiddenGemSelfAddOnData" as keys to handle first time click
    if (hiddenGemSelfAddOnData[place_id] === undefined) {
      hiddenGemSelfAddOnData[place_id] = {};

      setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
    };
  }

  const handleZoomChanged = () => {
    const zoomLevel = mapRef.current.getZoom();
    setZoom(zoomLevel);
    console.log(`Zoom level changed to: ${zoomLevel}`);
  };

  const onButtonChange = (e) => {
    console.log(e);
    e.preventDefault();

    let { name, id } = e.target;
    if (id === "like") {
      setLikeButtonStatus(name);
      console.log(likeButtonStatus);
    } else if (id === "visit") {
      setVisitButtonStatus(name);
      console.log(visitButtonStatus);
    } else if (id === "save") {
      setSaveButtonStatus(name);
      console.log(saveButtonStatus);
    }
  };

  useEffect(() => {
    if (likeButtonStatus !== null) {
      // Will here appear undefined because of empty database?
      let dbRefForLikes = ref(database, `${DB_HIDDENGEM_SELF_ADDON_DATA_KEY}/${hiddenGemId}/likes/${user.uid}`);

      console.log("Before onValue")
      onValue(dbRefForLikes, (data) => {
        console.log(data.val());
        if (hiddenGemSelfAddOnData[hiddenGemId].likes === undefined) {
          hiddenGemSelfAddOnData[hiddenGemId]["likes"] = {}
          hiddenGemSelfAddOnData[hiddenGemId].likes[user.uid] = data.val();

          console.log(hiddenGemSelfAddOnData);
          setLikeButtonStatus(null);
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        } else {
          hiddenGemSelfAddOnData[hiddenGemId].likes[user.uid] = data.val();

          console.log(hiddenGemSelfAddOnData);
          setLikeButtonStatus(null);
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        };
      });

      console.log("After onValue")
      if (likeButtonStatus === "true") {
        set(dbRefForLikes, false);
      } else if (likeButtonStatus === "false") {
        set(dbRefForLikes, true);
      };
    };
    //Re-render the modal
    cardRenderMain();
  }, [likeButtonStatus])

  useEffect(() => {
    if (visitButtonStatus !== null) {
      let dbRefForVisits = ref(database, `${DB_HIDDENGEM_SELF_ADDON_DATA_KEY}/${hiddenGemId}/visits/${user.uid}`);

      onValue(dbRefForVisits, (data) => {
        console.log(data.val());
        if (hiddenGemSelfAddOnData[hiddenGemId].visits === undefined) {
          hiddenGemSelfAddOnData[hiddenGemId]["visits"] = {}
          hiddenGemSelfAddOnData[hiddenGemId].visits[user.uid] = data.val();

          console.log(hiddenGemSelfAddOnData);
          setVisitButtonStatus(null);
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        } else {
          hiddenGemSelfAddOnData[hiddenGemId].visits[user.uid] = data.val();

          console.log(hiddenGemSelfAddOnData);
          setVisitButtonStatus(null);
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        };
      });

      if (visitButtonStatus === "true") {
        set(dbRefForVisits, false);
      } else if (visitButtonStatus === "false") {
        set(dbRefForVisits, true);
      };
    };
    //Re-render the modal
    cardRenderMain();
  }, [visitButtonStatus])

  useEffect(() => {
    if (saveButtonStatus !== null) {
      let dbRefForSaves = ref(database, `${DB_HIDDENGEM_SELF_ADDON_DATA_KEY}/${hiddenGemId}/saves/${user.uid}`);

      onValue(dbRefForSaves, (data) => {
        console.log(data.val());
        if (hiddenGemSelfAddOnData[hiddenGemId].saves === undefined) {
          hiddenGemSelfAddOnData[hiddenGemId]["saves"] = {}
          hiddenGemSelfAddOnData[hiddenGemId].saves[user.uid] = data.val();

          console.log(hiddenGemSelfAddOnData);
          setSaveButtonStatus(null);
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        } else {
          hiddenGemSelfAddOnData[hiddenGemId].saves[user.uid] = data.val();

          console.log(hiddenGemSelfAddOnData);
          setSaveButtonStatus(null);
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        };
      });

      if (saveButtonStatus === "true") {
        set(dbRefForSaves, false);
      } else if (saveButtonStatus === "false") {
        set(dbRefForSaves, true);
      };
    };
    //Re-render the modal
    cardRenderMain();
  }, [saveButtonStatus])

  const onCommentButtonClick = () => {
    setCardStage(1);
  }

  const onBackButtonClick = () => {
    setCardStage(0);
  }

  const onCommentBoxChange = (e) => {
    if (e !== undefined) {
      let { name, value } = e.target;
      if (name === "commentText") {
        setCommentText(value);
      };
      console.log(commentText);
    }
  }

  const handleCommentSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    console.log(user.uid);
    console.log(user.displayName);

    let dbRefForComments = ref(database, `${DB_HIDDENGEM_SELF_ADDON_DATA_KEY}/${hiddenGemId}/comments`);

    if (user.uid && commentText) {
      onChildAdded(dbRefForComments, (data) => {
        if (hiddenGemSelfAddOnData[hiddenGemId].comments === undefined) {
          hiddenGemSelfAddOnData[hiddenGemId]["comments"] = {};
          hiddenGemSelfAddOnData[hiddenGemId].comments[data.key] = data.val();

          setCommentText("");
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        } else {
          hiddenGemSelfAddOnData[hiddenGemId].comments[data.key] = data.val();

          setCommentText("");
          setHiddenGemSelfAddOnData(hiddenGemSelfAddOnData);
        }
      }); 

      console.log(user.uid);
      console.log(user.displayName);
      // Message submit to firebase
      push(dbRefForComments, {
        userId: user.uid,
        userName: user.displayName,
        commentText: commentText,
        commentDate: `${new Date()}`,
      });
      console.log(hiddenGemSelfAddOnData);
    }
  }

  const clearState = () => {
    setHiddenGemId(null);
    setCardRender("");
  }

  // Runs after this particular component is mounted.
  useEffect(() => {
    const dbRefForHiddenGem = ref(database, DB_HIDDENGEM_KEY)
    const dbRefForHiddenGemSelfAddOnData = ref(database, DB_HIDDENGEM_SELF_ADDON_DATA_KEY)
    
    onChildAdded(dbRefForHiddenGem, (data) => {
      setHiddenGem(hiddengem => {
        return {
          ...hiddengem,
          [data.key]: {...data.val()},
        }
      });
    });

    onChildAdded(dbRefForHiddenGemSelfAddOnData, (data) => {
      setHiddenGemSelfAddOnData(hiddengemAddOnData => {
        return {
          ...hiddengemAddOnData,
          [data.key]: {...data.val()},
        }
      });
    });

  }, []);

  // When map and center is updated, triggers "map.setCenter()".
  useEffect(() => {
    if (map) {
      console.log("Map being set");
      if (districtDetails !== undefined ) {
        if (Object.keys(districtDetails).length > 0) {
          setCenter(districtDetails.coordinates);
          setZoom(districtDetails.zoom);
          console.log("DistrictDetails validated and successfully set");
          setDistrictDetails({});
        }
      } 

      if (gemRedirectDetails !== undefined) {
        console.log("Enter gemRedirectDetails logic");
        if (Object.keys(gemRedirectDetails).length > 0) {
          setCenter(gemRedirectDetails.coordinates);
          setZoom(gemRedirectDetails.zoom);
          setHiddenGemId(gemRedirectDetails.place_id);
          console.log("GemRedirectDetails is successfull passed on");
          setGemRedirectDetails({});
        }
      }
    }
  }, [map])

  // When hiddenGemId is updated, triggers either "cardRenderMain()" to place the "<PlaceDetails/>" into return().
  useEffect(() => {
    cardRenderMain()
  }, [hiddenGemId])

  //Render Main Card of a place (Popping up on Screen)
  useEffect(() => {
    if (hiddenGemId && cardRender) {
      document.getElementById('placeDetailsModal').showModal();
    }
  }, [cardRender])

  // When hiddenGemSelfAddOnData is updated, triggers either "cardRenderMain()" or "cardRenderMessages()".
  useEffect(() => {
    if (cardStage === 0) {
      cardRenderMain();
    } else if (cardStage === 1) {
      cardRenderMessages();
    }
  }, [hiddenGemSelfAddOnData])

  // When cardStage is updated, triggers either "cardRenderMain()" or "cardRenderMessages()".
  useEffect(() => {
    if (cardStage === 0) {
      cardRenderMain();
    } else if (cardStage === 1) {
      cardRenderMessages();
    }
  }, [cardStage])

  // When commentText is updated, triggers "cardRenderMessages()". 
  useEffect(() => {
    cardRenderMessages();
  }, [commentText])

  const cardRenderMain = () => {
    // console.log("String")
    if (hiddenGemId !== null) {
      // console.log("Hello")
      let hiddenGemObject = hiddenGem[hiddenGemId];
      let hiddenGemSelfAddOnDataObject = hiddenGemSelfAddOnData[hiddenGemId];
      let newCardRender = (
          <PlaceDetails
            hiddenGemId={hiddenGemId} //equivalent to place_id
            //Data from Google API
            editorial_summary={hiddenGemObject.editorial_summary}
            formatted_address={hiddenGemObject.formatted_address}
            name={hiddenGemObject.name}
            rating={hiddenGemObject.rating}
            types={hiddenGemObject.types}
            clearState={clearState}
            //Data from user created inside App
            likes={hiddenGemSelfAddOnDataObject.likes}
            visits={hiddenGemSelfAddOnDataObject.visits}
            saves={hiddenGemSelfAddOnDataObject.saves}
            photos={hiddenGemSelfAddOnDataObject.photos}
            //Handles series of action
            onCommentButtonClick={onCommentButtonClick}
            onButtonChange={onButtonChange}
            // Create /Add to new trip attributes to be insert. 
          />
        );
      setCardRender(newCardRender);
    }
  }

  const cardRenderMessages = () => {
    let hiddenGemObject = hiddenGem[hiddenGemId];
    let hiddenGemSelfAddOnDataObject = hiddenGemSelfAddOnData[hiddenGemId];
    let cardRender = (
        <PlaceComments
          hiddenGemId={hiddenGemId} //equivalent to place_id
          //Data from Google API
          hiddenGemObject={hiddenGemObject}
          //Data from user created inside App
          hiddenGemSelfAddOnDataObject={hiddenGemSelfAddOnDataObject}
          //Handles series of action
          commentText={commentText}
          onBackButtonClick={onBackButtonClick}
          onCommentBoxChange={onCommentBoxChange}
          handleCommentSubmit={handleCommentSubmit}
        />
      );
    setCardRender(cardRender);
  }

  return (
    <div>
      <GoogleMap 
        zoom={zoom} 
        center={center}
        mapContainerClassName="map-container"
        onLoad={map => {
          mapRef.current = map;
          setMap(map);
          map.addListener('zoom_changed', handleZoomChanged);
        }}
        >
          <MarkerClusterer>
            {(clusterer) => addMarkers(clusterer)}
          </MarkerClusterer>
      </GoogleMap>
      {cardRender}
    </div>
  );
}
