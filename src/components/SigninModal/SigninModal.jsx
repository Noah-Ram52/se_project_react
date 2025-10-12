import "./SigninModal.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import closeButton from "../../assets/x_modal_button.svg";
import { signin } from "../../utils/auth";

function SigninModal({ activeModal, onClose, onLogin, setActiveModal }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // keep local references for convenience in JSX
  const { email, password } = formData;

  // SigninModal opens and shows the email password.
  // Reminder: activeModal is an empty string. Look in App.jsx line 82.
  if (activeModal !== "signin") return null;

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
          navigate("/"); // Adjust the path as needed
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
    <div className={`modal ${activeModal === "signin" ? "modal_opened" : ""} `}>
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>
          <img src={closeButton} className="" alt="Close__Signup_Button" />
        </button>
        <h3 className="modal__title">Log In</h3>
        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="modal__label">
            Email
            <input
              className="modal__label_account_info modal__input_text"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label className="modal__label">
            Password
            <input
              className="modal__label_account_info modal__input_text"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          {error && <div className="">{error}</div>}
          <div>
            <button
              className="modal__submit"
              type="submit"
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? "Signing in..." : "Log In"}
            </button>
            <button
              type="button"
              className="modal__redirect_signup"
              onClick={() => {
                setActiveModal("signup"); // Switch to RegisterModal
                setError(""); // Clear any error in SigninModal
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
