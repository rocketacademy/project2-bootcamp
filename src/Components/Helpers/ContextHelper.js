import { useContext } from "react";
import { UserContext } from "../../App.js";

/*  Usage - pull global context anywhere in the App
import ContextHelper from "../ContextHelper";

const pairKey = ContextHelper("pairKey"); // output: loverboy
const isLoggedIn = ContextHelper("isLoggedIn"); // output: true
const email = ContextHelper("email"); //output: xx@email.com */

const ContextHelper = (type) => {
  const context = useContext(UserContext);
  let result = "";

  if (type === "pairKey") {
    result = context.pairKey || "";
  } else if (type === "isLoggedIn") {
    result = context.isLoggedIn || "";
  } else if (type === "email") {
    result = context.email || "";
  }
  return result;
};

export default ContextHelper;
