import { useMemo, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

export default function Map() {
  const center = useMemo(() => ({ lat: 22.396427, lng: 114.109497 }), []);
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  return (
    <div className="flex">
      <div className="flex flex-col">
        <div className="form-control w-full max-w-xs mx-8">
          <Autocomplete>
            <input
              type="text"
              placeholder="Origin"
              className="input input-bordered w-full max-w-xs"
              ref={originRef}
            />
          </Autocomplete>
          <br />
          <Autocomplete>
            <input
              type="text"
              placeholder="Destination"
              className="input input-bordered w-full max-w-xs"
              ref={destinationRef}
            />
          </Autocomplete>
        </div>
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Distance</div>
            <div className="stat-value">{distance}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Duration</div>
            <div className="stat-value">{duration}</div>
          </div>
        </div>
        <button
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          type="submit"
          onClick={calculateRoute}
        >
          Calculate Route
        </button>
        <button className="btn" onClick={clearRoute}>
          Clear Route
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          > */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
          {/* </svg> */}
        </button>
        <button
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          type="submit"
          onClick={() => {
            map.panTo(center);
            map.setZoom(15);
          }}
        >
          Return
        </button>
      </div>
    
      <GoogleMap
        zoom={15}
        center={center}
        mapContainerClassName="map-container"
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => setMap(map)}
      >
        <Marker position={selected} />
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </div>
  );
}


