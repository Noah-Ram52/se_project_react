import { useState } from "react";
import "./SigninModal.css";
import closeButton from "../../assets/x_modal_button.svg";
import { signin } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

function SigninModal({ isOpen, onClose, onLogin, onSwitchToSignup }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // keep local references for convenience in JSX
  const { email, password } = formData;

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setIsSubmitting(true);
    signin({ email, password })
      .then((res) => {
        setIsSubmitting(false);
        // server returns { token }
        if (res && res.token) {
          try {
            // Login successful, save the token for the user
            // relate back to api.js change localStorage
            localStorage.setItem("jwt", res.token);
          } catch (e) {
            void e;
          }
          if (typeof onLogin === "function") onLogin(res.token);
          onClose && onClose();
          // navigate to protected route after successful login
          navigate("/login");
        } else {
          setError("Signin succeeded but token missing.");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setError(typeof err === "string" ? err : "Signin failed.");
        // optionally log the error for debugging
        // console.error(err);
      });
  }

  return (
    <div className="signin-modal">
      <div className="signin-modal__content">
        <button className="signin-modal__close" onClick={onClose}>
          <img
            src={closeButton}
            className="close_signin"
            alt="Close__Signup_Button"
          />
        </button>
        <h3 className="signin__title">Log In</h3>
        <form className="signin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          {error && <div className="signin-form__error">{error}</div>}
          <div className="signin-form__actions">
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="signin-form__submit"
            >
              {isSubmitting ? "Signing in..." : "Log In"}
            </button>
            <button
              type="button"
              className="signin-form__signup-link"
              onClick={() => {
                // clear any local error, then ask parent to switch to signup modal
                setError("");
                if (typeof onSwitchToSignup === "function") onSwitchToSignup();
              }}
            >
              or Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SigninModal;
