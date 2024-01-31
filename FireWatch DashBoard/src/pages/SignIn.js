import SignInForm from "../components/SignInForm";
import "./SignIn.css";
const SignIn = () => {
  return (
    <main className="sign-in">
      <div className="signincontainer">
        <div className="signinform">
          <div className="logo1">
            <b className="firewatch1">FireWatch</b>
          </div>
          <SignInForm />
        </div>
      </div>
      <img className="fireimage-icon" alt="" src="/fireimage@2x.png" />
    </main>
  );
};

export default SignIn;
