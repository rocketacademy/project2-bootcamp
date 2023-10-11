import { useContext } from "react";
import { UserContext } from "../App.js";

const ContextHelper = (type) => {
  const context = useContext(UserContext);
  let result = "";

  if (type === "pairKey") {
    result = context.pairKey || "";
  } else if (type === "isLoggedIn") {
    result = context.isLoggedIn || "";
  }
  return result;
};

export default ContextHelper;
