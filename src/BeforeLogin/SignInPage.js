import { useNavigate } from "react-router-dom";

// need to add logic to Sign in with firebase auth
//After login into the auth, return to "/"
export default function SignInPage() {
  const navi = useNavigate();

  return (
    <div className="App">
      <button onClick={() => navi("/")}>Sign in</button>
    </div>
  );
}
