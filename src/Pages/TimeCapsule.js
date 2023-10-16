import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import firebase from "firebase/app";
import "firebase/auth";

import NavBar from "../Details/NavBar.js";

const TimeCapsule = () => {
  const gapi = window.gapi;
  const google = window.google;
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES =
    "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar";

  const authenticateWithGoogle = (auth) => {
    const calendar = google.calendar({ version: "v3", auth });
    return calendar;
  };

  // Make a call to list the user's events
  const listEvents = async (auth) => {
    const calendar = authenticateWithGoogle(auth);
    try {
      const response = await calendar.events.list({
        calendarId: "primary", // "primary" refers to the user's primary calendar
      });
      const events = response.data.items;
      return events;
    } catch (error) {
      console.error("Error listing events:", error);
      return [];
    }
  };

  // Implement a function to sign in with Google
  const signInWithGoogle = async () => {
    try {
      await firebase.auth().signInWithPopup(googleProvider);
      // After a successful sign-in, you can use the authenticated user to access the Google Calendar API.
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Implement a function to sign out
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // const signIn = () => {
  //   gapi.load("client:auth2", () => {
  //     console.log("loaded gapi client");
  //     gapi.client.init({
  //       apiKey: API_KEY,
  //       clientId: CLIENT_ID,
  //       discoveryDocs: DISCOVERY_DOC,
  //       scope: SCOPES,
  //     });

  //     gapi.client.load("calendar", "v3", () => console.log("bam!"));

  //     //   gapi.auth2
  //     //     .getAuthInstance()
  //     //     .signIn()
  //     //     .then(() => {});
  //     // });
  //   });
  // };

  // const signIn = () => {
  //   gapi.load("client:auth2", () => {
  //     console.log("loaded gapi client");
  //     gapi.client
  //       .init({
  //         apiKey: API_KEY,
  //         clientId: CLIENT_ID,
  //         discoveryDocs: DISCOVERY_DOC,
  //         scope: SCOPES,
  //       })
  //       .then(() => {
  //         console.log("Initialization successful");
  //         return gapi.auth2.getAuthInstance().signIn();
  //       })
  //       .then(() => {
  //         console.log("User signed in successfully");
  //       })
  //       .catch((error) => {
  //         console.error("Error during authentication:", error);
  //       });
  //   });
  // };

  // const initializeGoogleAPI = () => {
  //   gapi.load("client:auth2", () => {
  //     console.log("loaded gapi client");
  //     gapi.client
  //       .init({
  //         apiKey: API_KEY,
  //         clientId: CLIENT_ID,
  //         discoveryDocs: [DISCOVERY_DOC],
  //         scope: SCOPES,
  //       })
  //       .then(() => {
  //         console.log("Google API client initialized");
  //         gapi.client.load("calendar", "v3", () => {
  //           console.log("Google Calendar API loaded");
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error initializing Google API:", error);
  //       });
  //   });
  // };

  // const signIn = () => {
  //   initializeGoogleAPI();

  //   gapi.auth2
  //     .getAuthInstance()
  //     .signIn()
  //     .then(() => {
  //       console.log("User signed in successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error during sign-in:", error);
  //     });
  // };
  const event = {
    summary: "Google I/O 2015",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: "2023-10-13T09:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: "2023-10-13T17:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
    attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };
  const addEvent = () => {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      // Prompt the user to sign in first
      console.log("User is not signed in. Please sign in.");
      return;
    }

    const request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("Inserting Event");

    request.execute(function (response) {
      if (response.error) {
        console.error("Error adding event:", response.error.message);
      } else {
        console.log("Event added successfully.");
        window.open(response.htmlLink);
      }
    });
  };

  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <NavBar label="Time Capsule" />
      <main>
        <button className="btn" onClick={signIn}>
          Sign In
        </button>
        <button className="btn" onClick={addEvent}>
          Add Event
        </button>
      </main>
    </div>
  );
};

export default TimeCapsule;
