import "./SigninModal.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
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

  const isSubmitDisabled =
    !formData.email.trim() || !formData.password || isSubmitting;

  // Note: Important to get rid of <div></div> tags.
  // 1. Avoids duplication because ModalWithForm renders all the outer modal elments.
  // 2. Ensure Consistancy of the passing form fied and content as children, from all modals.
  // 3. Reduce amount of bugs that may be created.

  return (
    <ModalWithForm
      title="Log In"
      buttonText={isSubmitting ? "Signing in..." : "Log In"}
      onClose={() => {
        onClose();
        setError("");
      }}
      isOpen={activeModal === "signin"}
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}
    >
      <label className="modal__label">
        Email
        <input
          className="modal__label_account_info modal__input_text"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
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
          required
        />
      </label>
      {error && <div className="modal__error">{error}</div>}
      <button
        type="button"
        className="modal__redirect_signup"
        disabled={isSubmitting}
        onClick={() => {
          setActiveModal("signup");
          setError("");
        }}
      >
        or Sign Up
      </button>
    </ModalWithForm>
  );
}

export default SigninModal;
