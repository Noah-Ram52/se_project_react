import "./RegisterModal.css";

import { useState, useEffect } from "react";
import closeButton from "../../assets/x_modal_button.svg";
import { signup, signin, saveToken } from "../../utils/auth";

// 🔹 Getting `activeModal` and `setActiveModal` from App.jsx
function RegisterModal({
  activeModal,
  onClose,
  setIsLoggedIn,
  onAuthLogin,
  setActiveModal,
}) {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    avatarUrl: "",
  });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO - Create animation for open/closing modal

  // 🔹 Modal visibility now depends on activeModal from App.jsx
  //  Reminder the default value of activeModal is ""
  //  Therefore, since we have "signup" the strict inequality will return true.
  //  This will make the modal open.
  if (activeModal !== "signup") return null;

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setErrors("");
    const { email, password, name, avatarUrl } = formData;

    if (!email.trim() || !password || !name.trim() || !avatarUrl.trim()) {
      setErrors("Please fill in all required fields.");
      return;
    }

    // normalize avatar URL
    // If there is any extra spacing it removes that
    // Example: If user enters, " https://example.com/avatar.jpg "
    // After using trim it becomes, "https://example.com/avatar.jpg"
    let normalizedAvatar = avatarUrl.trim();

    // Adds https:// if the user forgets it
    if (!/^https?:\/\//i.test(normalizedAvatar)) {
      normalizedAvatar = `https://${normalizedAvatar}`;
    }

    // Validate URL
    try {
      new URL(normalizedAvatar);
    } catch {
      setErrors("Invalid avatar URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Register new user
      await signup({
        name: name.trim(),
        avatar: normalizedAvatar,
        email: email.trim(),
        password,
      });

      // Auto-login after successful signup
      const signinRes = await signin({ email: email.trim(), password });
      const token = signinRes?.token;
      if (token) {
        if (typeof onAuthLogin === "function") await onAuthLogin(token);
        else {
          saveToken(token);
          if (typeof setIsLoggedIn === "function") setIsLoggedIn(true);
        }
      }
      // 🔹 Close modal via App (replaces old setShowSignin/setShowSignup)
      onClose();
      setFormData({ email: "", password: "", name: "", avatarUrl: "" });
    } catch (err) {
      setErrors(
        typeof err === "string" ? err : err?.message || "Signup failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // Added `modal` and `modal_opened` for animation control
    <div className={`modal ${activeModal === "signup" ? "modal_opened" : ""} `}>
      <div className="modal__content">
        <div className="">
          <button
            className="modal__close"
            onClick={() => {
              onClose();
              setErrors("");
            }}
          >
            <img src={closeButton} className="" alt="Close Signup Button" />
          </button>
          <h2 className="modal__title">Sign Up</h2>
          <form className="modal__form" onSubmit={handleSubmit}>
            <label className="modal__label">
              Email*
              <input
                className="modal__label_account_info modal__input_text"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </label>

            <label className="modal__label">
              Password*
              <input
                className="modal__label_account_info modal__input_text"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </label>

            <label className="modal__label">
              Name*
              <input
                className="modal__label_account_info modal__input_text"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </label>

            <label className="modal__label">
              Avatar URL*
              <input
                className="modal__label_account_info modal__input_text"
                name="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="Avatar URL"
              />
            </label>

            {/* 🔹 Show validation or API errors */}
            {errors && <div>{errors}</div>}

            <div className="modal__error">
              <button type="submit" className="modal__submit">
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
              <button
                type="button"
                className="modal__redirect_login"
                onClick={() => {
                  setActiveModal("signin");
                  setErrors("");
                }}
              >
                or Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
