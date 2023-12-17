// Make a provider file 
import { useState, createContext } from "react";

export const CoordinatesContext = createContext();

export default function CoordinatesProvider({ children }) {
  const [ districtDetails, setDistrictDetails ] = useState({});
  const [ gemRedirectDetails, setGemRedirectDetails ] = useState({})

  return (
    <CoordinatesContext.Provider value={{ districtDetails, setDistrictDetails, gemRedirectDetails, setGemRedirectDetails}}>
      {children}
    </CoordinatesContext.Provider>
  );
}