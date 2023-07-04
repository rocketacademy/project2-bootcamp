import { Button } from "react-bootstrap";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function GoogleButton() {
  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // You can now navigate or do something with the user info.
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      variant="danger"
      onClick={signInWithGoogle}
      style={{ width: "40%", marginLeft: "15px" }}
    >
      Sign In Google
    </Button>
  );
}
