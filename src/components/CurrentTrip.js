import { useContext, useEffect, useState } from "react";
import { TripContext } from "../Provider/TripProvider.js";
import { database } from "../firebase.js";
import { ref, set, get, onValue } from "firebase/database";
import React from "react";
import "./CurrentTrip.css";
import Carousel from "./Carousel.js";

const DB_GEMS_KEY = "hiddengems";
const DB_TRIPS_KEY = "trips";
const DB_PHOTOS_KEY = "hiddengems-selfaddondata";

export default function CurrentTrip() {
  const [gems, setGems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gemIdToDelete, setGemIdToDelete] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isGemAlreadyAdded, setIsGemAlreadyAdded] = useState(false)
  const [gemPhotos, setGemPhotos] = useState({});

  const {
    title,
    date,
    addedGems = [],
    setAddedGems,
    key,
  } = useContext(TripContext);

  useEffect(() => {
    const fetchGems = async () => {
      const gemsRef = ref(database, DB_GEMS_KEY);
      try {
        const snapshot = await get(gemsRef);
        if (snapshot.exists()) {
          setGems(Object.values(snapshot.val()));
        }
      } catch (error) {
        console.error("Error fetching gems:", error);
      }
    };

    const fetchPhotoUrls = async () => {
      const photosRef = ref(database, DB_PHOTOS_KEY);
      try {
        const snapshot = await get(photosRef);
        if (snapshot.exists()) {
          const fetchedPhotos = snapshot.val()
          console.log(
            "Fetched photos are",
            fetchedPhotos["ChIJ57HdoAAMBDQRTy_mf7CoRRk"].photos
          );
          setGemPhotos(fetchedPhotos);
        }
      } catch (error) {
        console.error("Error fetching photo URLs:", error);
      }
    };
    fetchGems();
    fetchPhotoUrls()
  }, []);

  function formatDate(rawDate) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(rawDate);
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  }

  function DeleteModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-lg w-96">
          <h2 className="text-xl mb-4">Are you sure?</h2>
          <p className="mb-4">Do you want to remove this gem from the trip?</p>
          <div className="flex justify-end">
            <button
              className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onCancel}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

  function GemAlertModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-lg w-96">
          <h2 className="text-xl mb-4">Oops!</h2>
          <p>This gem is already in the trip!</p>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={onClose}
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    );
  }

  function generateStarRating(rating) {
    const maxStars = 5;
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      // Calculate the class based on whether it's a full star, a half star, or empty star
      let starClass = "bg-green-500 mask mask-star-2";
      if (i <= rating) {
        if (i === Math.ceil(rating) && rating % 1 !== 0) {
          // This is a half star
          starClass += " mask-half-1"; // Add the class for half star
        }
      } else {
        starClass = "rating-hidden"; // Empty star
      }

      stars.push(
        <input
          key={i}
          type="radio"
          name={`rating-${rating}`}
          className={starClass}
        />
      );
    }
    return (
      <div className="rating rating-lg rating-half">
        {stars.map((star, index) => React.cloneElement(star, { key: index }))}
      </div>
    );
  }

  const handleAddToTrip = (gem) => {

      if (addedGems.includes(gem.place_id)) {
        setIsGemAlreadyAdded(true);
        return;
      }

      const newAddedGems = [...addedGems, gem.place_id];
      setAddedGems(newAddedGems)
      console.log("Added Gems after adding:", newAddedGems);

      const tripRef = ref(database, `${DB_TRIPS_KEY}/${key}/addedGems`);
        try {
          // Update the 'addedGems' field in the specific trip
          set(tripRef, newAddedGems);

        } catch (error) {
          console.error("Error updating addedGems in the database:", error);
          setAddedGems(addedGems);
          setGems([...gems, gem]);
        }
      }

  const populateAddedGems = () => {
    return (
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-md p-4">
        
        {addedGems.length > 0 ? (
          <div className="card-body">
            {addedGems.map((gemId) => {
              console.log(gemId);
              const gem = gems.find((g) => g.place_id === gemId);
              console.log(gem);
              if (gem) {
                return (
                  <div key={gem.place_id} className="relative mb-4">
                    <figure className="mb-2">
                      <img
                        src={
                          (gemPhotos[gem.place_id] &&
                            gemPhotos[gem.place_id].photos &&
                            gemPhotos[gem.place_id].photos[0]) ||
                          "https://images.unsplash.com/photo-1518599807935-37015b9cefcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80"
                        }
                        alt={gem.name}
                      />
                    </figure>
                    <h2 className="card-title mb-2">{gem.name}</h2>
                    {gem.editorial_summary ? (
                      <p className="mb-2">{gem.editorial_summary.overview}</p>
                    ) : (
                      <p className="mb-2">{gem.formatted_address}</p>
                    )}
                    <div className="rating mb-2">
                      {generateStarRating(gem.rating)}
                    </div>
                    <button
                      className={`absolute top-2 right-2 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600 ${
                        isShaking ? "shake" : ""
                      }`}
                      onMouseEnter={() => setIsShaking(true)}
                      onMouseLeave={() => setIsShaking(false)}
                      onClick={() => {
                        setIsModalOpen(true);
                        setGemIdToDelete(gem.place_id);
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <p>No Gems have been added to the trip yet.</p>
        )}
      </div>
    );
  }

  useEffect(() => {
    // Listen to changes on the specific trip's data
    // const tripRef = ref(database, `${DB_TRIPS_KEY}/${key}/addedGems`);

    // const tripChanged = onValue(tripRef, (snapshot) => {
    //   console.log("Database value changed", snapshot.val());
    //   const updatedTripData = snapshot.val();
    //   if (updatedTripData && updatedTripData.addedGems) {
    //     setAddedGems(updatedTripData.addedGems);
    //   }
    // });

    // return () => {
    //   tripChanged();
    // };
    populateAddedGems()
  }, [addedGems]);

  const handleRemoveFromTrip = async (gemIdToRemove) => {
    const updatedGems = addedGems.filter((gemId) => gemId !== gemIdToRemove);
    setAddedGems(updatedGems);

    const gemToRemove = gems.find((g) => g.place_id === gemIdToRemove);
    if (gemToRemove) {
      setGems((prevGems) => [...prevGems, gemToRemove]);
    }

    // Now update the database
    const tripRef = ref(database, `${DB_TRIPS_KEY}/${key}/addedGems`);
    try {
      await set(tripRef, updatedGems);
      setIsModalOpen(false);
      setGemIdToDelete(null);
    } catch (error) {
      console.error("Error removing gem from the trip in the database:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div>
          {title && <h1 className="title-font mb-2">{title}</h1>}
          {date ? (
            <div>
              <h1 className="date-font mb-1">
                Start: {formatDate(date.startDate)}
              </h1>
              <h1 className="date-font">End: {formatDate(date.endDate)}</h1>
            </div>
          ) : null}
        </div>
      </div>

      <div className="top-card-container mb-4">{populateAddedGems()}</div>

      <div className="suggestions-container">
        <h2 className="title-font mb-4">Suggestions</h2>
        <div className="carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box">
          <div className="carousel-item space-x-4">
            {gems.map((gem, index) => (
              <div
                className={`card card-compact w-96 bg-base-100 shadow-xl mb-4 ${
                  addedGems.includes(gem.place_id) ? "gem-already-added" : ""
                }`}
                key={index}
              >
                <figure className="mb-2">
                  <Carousel
                    images={
                      (gemPhotos[gem.place_id] && gemPhotos[gem.place_id].photos) || []
                    }
                  ></Carousel>
                </figure>
                <div className="card-body">
                  <h2 className="card-title mb-2">{gem.name}</h2>
                  {gem.editorial_summary ? (
                    <p className="mb-2">{gem.editorial_summary.overview}</p>
                  ) : (
                    <p className="mb-2">{gem.formatted_address}</p>
                  )}
                  <div className="rating mb-2">
                    {generateStarRating(gem.rating)}
                  </div>
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToTrip(gem)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onConfirm={() => {
          if (gemIdToDelete) handleRemoveFromTrip(gemIdToDelete);
          setIsModalOpen(false);
          setGemIdToDelete(null);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setGemIdToDelete(null);
        }}
      />
      <GemAlertModal
        isOpen={isGemAlreadyAdded}
        onClose={() => setIsGemAlreadyAdded(false)}
      />
    </div>
  );
}
