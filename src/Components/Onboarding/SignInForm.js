import Button from "../../Details/Button";

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
          className="input bg-white"
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
          className="input bg-white"
          id="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </form>
      <p className="m-1">{errorMessage}</p>
      <Button label="Sign in" handleClick={signIn} />
      <button
        onClick={resetPassword}
        className="m-2 text-sm text-slate-500 hover:translate-y-[-2px] hover:text-slate-800"
      >
        Forgotten password
      </button>
    </>
  );
}

export default SignInForm;
