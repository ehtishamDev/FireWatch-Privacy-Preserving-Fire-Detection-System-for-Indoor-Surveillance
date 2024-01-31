import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithEmail } from "../firebase"; // Assuming this is the path to your firebase.js file
import "./SignInForm.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onButtonClick = useCallback(async () => {
    try {
      // Call the new signInWithEmailAndPassword function to sign in with email and password
      await signInWithEmail(email, password);
      navigate("/dashboard"); // Navigate to the dashboard after successful sign-in (you can handle this differently based on your use case)
    } catch (error) {
      setError(error.message);
    }
  }, [navigate, email, password]);

  const onButton1Click = useCallback(async () => {
    try {
      // Call the signInWithGoogle function to trigger the Google Sign-In popup
      await signInWithGoogle();
      navigate("/dashboard"); // Navigate to the dashboard after successful sign-in (you can handle this differently based on your use case)
    } catch (error) {
      setError("Error signing in with Google: " + error.message);
    }
  }, [navigate]);

  return (
    <div className="sign-in1">
      <div className="title">
        <div className="welcome-back">Welcome back</div>
        <div className="empower-your-admin">Empower your admin authority</div>
      </div>
      <div className="main1">
        <div className="inputsform">
          <div className="input">
            <div className="email-wrapper">
              <div className="email">Email</div>
            </div>
            <input
              className="input-child"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input1">
            <div className="email-wrapper">
              <div className="email">Password</div>
            </div>
            <input
              className="input-item"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="reminders">
        <div className="signinbuttons">
          <button className="button" onClick={onButtonClick}>
            <div className="sign-in2">Sign in</div>
          </button>
          <button className="button1" onClick={onButton1Click}>
            <img className="icongoogle" alt="" src="/icongoogle.svg" />
            <div className="sign-in-with">Sign in with Google</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
