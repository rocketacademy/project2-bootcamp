import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const PrivateRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;
