import React from "react";

function CalendarButton({ startTime, endTime, title, description, location }) {
  const generateCalendarLink = () => {
    const startTimestamp = new Date(startTime)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const endTimestamp = new Date(endTime)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");

    // Construct a Google Calendar event URL
    const googleCalendarURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimestamp}/${endTimestamp}&details=${description}&location=${location}&sprop=name:PairedUp`;

    // Open the event in a new tab
    window.open(googleCalendarURL, "_blank");
  };

  return (
    <button
      onClick={generateCalendarLink}
      className="rounded-full bg-text p-[9px] text-lg leading-[18px] hover:bg-slate-400"
    >
      🗓️
    </button>
  );
}

export default CalendarButton;
