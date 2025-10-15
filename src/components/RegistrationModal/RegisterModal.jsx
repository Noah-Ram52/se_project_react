import "./RegisterModal.css";

import { useState, useEffect } from "react";

import ModalWithForm from "../ModalWithForm/ModalWithForm";
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

  // Rests the form when modal opens

  useEffect(() => {
    if (activeModal === "signup") {
      setFormData({
        email: "",
        password: "",
        name: "",
        avatarUrl: "",
      });
      setErrors("");
    }
  }, [activeModal]);

  // Hide modal if it's not active
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

    // Normalize avatar URL
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

  // Disables button if fields are empty or submitting
  const isSubmitDisabled =
    !formData.email.trim() ||
    !formData.password ||
    !formData.name.trim() ||
    !formData.avatarUrl.trim() ||
    isSubmitting;

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText={isSubmitting ? "Signing up..." : "Sign Up"}
      onClose={() => {
        onClose();
        setErrors("");
      }}
      isOpen={activeModal === "signup"}
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}
    >
      <label className="modal__label">
        Email*
        <input
          className="modal__label_account_info modal__input_text"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
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
          required
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
          required
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
          required
        />
      </label>

      {errors && <div className="modal__error">{errors}</div>}

      <button
        type="button"
        className="modal__redirect_login"
        disabled={isSubmitting}
        onClick={() => {
          setActiveModal("signin");
          setErrors("");
        }}
      >
        or Log In
      </button>
    </ModalWithForm>
  );
}

export default RegisterModal;
