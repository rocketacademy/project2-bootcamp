import React from "react";

function CalendarButton({ eventDetails }) {
  const generateCalendarLink = () => {
    console.log(eventDetails);
    const startTimestamp = new Date(eventDetails.startTime)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const endTimestamp = new Date(eventDetails.endTime)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");

    // Construct a Google Calendar event URL
    const googleCalendarURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventDetails.summary}&dates=${startTimestamp}/${endTimestamp}&details=${eventDetails.description}&location=${eventDetails.location}&sprop=name:YourAppName`;

    // Open the event in a new tab
    window.open(googleCalendarURL, "_blank");
  };

  return <button onClick={generateCalendarLink}>Add to Calendar</button>;
}

export default CalendarButton;
