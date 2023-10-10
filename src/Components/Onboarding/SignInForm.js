// import { NavLink } from "react-router-dom";

function SignInForm({
  signIn,
  setEmail,
  setPassword,
  email,
  password,
  errorMessage,
  resetPassword,
}) {
  return (
    <>
      <form>
        <label>Email:</label>
        <br />
        <input
          type="text"
          className="input"
          id="email"
          placeholder="morty-smith@adultswim.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <label>Password:</label>
        <br />

        <input
          type="password"
          className="input"
          id="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </form>
      <p className="m-1">{errorMessage}</p>
      <button className="btn mt-3" onClick={signIn}>
        Sign In
      </button>
      <button onClick={resetPassword} className="m-1 text-slate-500">
        Forgotten password
      </button>
    </>
  );
}

export default SignInForm;
