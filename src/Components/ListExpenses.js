import "../App.css";
import InputExpenses from "./InputExpenses";

export default function ListExpenses({
  uid,
  userLocation,
  setUserLocation,
  mapRef,
  setMapRef,
}) {
  return (
    <div className="list-container">
      <InputExpenses
        uid={uid}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        mapRef={mapRef}
        setMapRef={setMapRef}
      />
      List Component
    </div>
  );
}
