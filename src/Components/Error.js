// File to contain 'Error' message
import NavBar from "./NavBar";

export default function Error() {
  return (
    <>
      <NavBar />
      <div className="temporary-box">
        I'm sorry, but the URL you entered is not recognized by our application.
        <br />
        Please ensure you have entered the correct URL or try a different one.{" "}
        <br />
        If you continue to encounter this issue, please contact our support team
        for further assistance. Thank you.
      </div>
    </>
  );
}
