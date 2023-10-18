import { useContext } from "react";
import { UserContext } from "../../App.js";

/*  Usage - pull global context anywhere in the App
import ContextHelper from "../ContextHelper";

const pairKey = ContextHelper("pairKey"); // output: loverboy
const isLoggedIn = ContextHelper("isLoggedIn"); // output: true
const displayName = ContextHelper("displayName"); //output: Romeo
const email = ContextHelper("email"); //output: xx@email.com */

const ContextHelper = (type) => {
  const context = useContext(UserContext);
  let result = "";

  if (type === "pairKey") {
    result = context.pairKey || "";
  } else if (type === "isLoggedIn") {
    result = context.isLoggedIn || "";
  } else if (type === "displayName") {
    result = context.displayName || "";
  } else if (type === "email") {
    result = context.email || "";
  } else if (type==='setDisplayName') {
    result =context.setDisplayName || ''
  }
  return result;
};

export default ContextHelper;
