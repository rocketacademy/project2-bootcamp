import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import { Loader } from "@googlemaps/js-api-loader";

let map;

async function initMap() {
  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    version: "weekly",
  });

  await loader.load();

  const { Map } = google.maps;

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

initMap();

export default Map;
