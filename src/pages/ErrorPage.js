import { useRouteError } from "react-router-dom";
import "../App.css";

import Header from "../components/header.js";

const ErrorPage = () => {

  const error = useRouteError();
  console.error(error);

  return (
    <div className="App">
      <Header />
      <div>
        <br />
        <h2>Oops!</h2>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
