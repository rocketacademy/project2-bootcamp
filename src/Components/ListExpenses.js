import "../App.css";
import InputExpenses from "./InputExpenses";

export default function ListExpenses({
  uid,
  userLocation,
  setUserLocation,
  mapRef,
  setMapRef,
  // isLoaded,
}) {
  return (
    <div className="list-container">
      <InputExpenses
        uid={uid}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        mapRef={mapRef}
        setMapRef={setMapRef}
        // isLoaded={isLoaded}
      />
      List Component
    </div>
  );
}
