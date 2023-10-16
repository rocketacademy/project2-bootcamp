import React, { useState } from "react";
import CalendarButton from "../Components/Dates/CalendarButton.js";
import NavBar from "../Details/NavBar.js";

const Calendar = () => {
  const [eventDetails, setEventDetails] = useState({
    startTime: "",
    endTime: "",
    summary: "",
    description: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });
  };

  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <NavBar label="Title" />
      <main>
        <h1>Event Details</h1>
        <input
          type="datetime-local"
          name="startTime"
          value={eventDetails.startTime}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="endTime"
          value={eventDetails.endTime}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="summary"
          placeholder="Event Title"
          value={eventDetails.summary}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Event Description"
          value={eventDetails.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={eventDetails.location}
          onChange={handleInputChange}
        />
        <CalendarButton eventDetails={eventDetails} />
      </main>
    </div>
  );
};

export default Calendar;
