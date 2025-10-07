import "./RegisterModal.css";
import logo from "../../assets/Logo.svg";
import closeButton from "../../assets/x_modal_button.svg";
import WeatherCard from "../WeatherCard/WeatherCard";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import ItemCard from "../ItemCard/ItemCard";
import SigninModal from "../SigninModal/SigninModal";
import { Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { signup, signin, saveToken } from "../../utils/auth";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

function RegisterModal({
  weatherData,
  handleCardClick,
  clothingItems,
  setIsLoggedIn,
  onAuthLogin, // optional: App should pass this to refresh currentUser
}) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  // Format current date as "Month Day", e.g., "September 21"
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const [time, setTime] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    avatarUrl: "",
  });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // keep local references for convenience in JSX
  const { email, password, name, avatarUrl } = formData;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors("");
    const { email, password, name, avatarUrl } = formData;
    if (!email.trim() || !password || !name.trim() || !avatarUrl.trim()) {
      setErrors("Please fill in all required fields.");
      return;
    }

    // normalize avatar URL (try adding https:// if missing)
    let normalizedAvatar = avatarUrl.trim();
    try {
      new URL(normalizedAvatar);
    } catch {
      if (!/^https?:\/\//i.test(normalizedAvatar)) {
        normalizedAvatar = `https://${normalizedAvatar}`;
        try {
          new URL(normalizedAvatar);
        } catch {
          setErrors("Invalid avatar URL.");
          return;
        }
      } else {
        setErrors("Invalid avatar URL.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: name.trim(),
        avatar: normalizedAvatar,
        email: email.trim(),
        password,
      });

      const signinRes = await signin({ email: email.trim(), password });

      const token = signinRes?.token;
      if (token) {
        if (typeof onAuthLogin === "function") {
          await onAuthLogin(token);
        } else {
          saveToken(token);
          if (typeof setIsLoggedIn === "function") setIsLoggedIn(true);
        }
      }
      setShowSignup(false);
      setFormData({ email: "", password: "", name: "", avatarUrl: "" });
    } catch (err) {
      setErrors(
        typeof err === "string" ? err : err?.message || "Signup failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    function updateCentralDaylightTime() {
      const now = new Date();
      const centralTime = now.toLocaleString("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(centralTime);
    }

    updateCentralDaylightTime();
    const interval = setInterval(updateCentralDaylightTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Log in, register, Add item modals
  return (
    <div className="registration">
      {/* Sign up modal */}
      {/* Conditional rendering — 
      if showSignup is true, the modal is shown.
      Otherwise, nothing is rendered. */}
      {showSignup && (
        <div className="signup-modal">
          <div className="signup-modal__content">
            <button
              className="signup-modal__close"
              onClick={() => {
                setShowSignup(false); // 1. Hide the signup modal
                setErrors(""); //  2. Clear any validation/server errors
              }}
            >
              <img
                src={closeButton}
                className="close_signup"
                alt="Close__Signup_Button"
              />
            </button>
            <h3 className="signup-form_title">Sign Up</h3>

            <form className="signup-form" onSubmit={handleSubmit}>
              <label>
                Email*
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </label>

              <label>
                Password*
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </label>

              <label>
                Name *
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
              </label>

              <label>
                Avatar URL *
                <input
                  name="avatarUrl"
                  type="url"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="Avatar URL"
                />
              </label>

              {errors && <div className="signup-form__error">{errors}</div>}

              <div className="signup-form__actions">
                <button
                  type="submit"
                  disabled={
                    isSubmitting || !email || !password || !avatarUrl || !name
                  }
                  className="signup-form__submit"
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
                <button
                  type="button"
                  className="signup-form__login-link"
                  onClick={() => {
                    setShowSignup(false);
                    setShowSignin(true);
                    setErrors("");
                  }}
                >
                  or Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signin modal */}
      <SigninModal
        isOpen={showSignin}
        onClose={() => setShowSignin(false)}
        onSwitchToSignup={() => {
          setShowSignin(false);
          setShowSignup(true);
          setErrors("");
        }}
        onLogin={(token) => {
          // notify App or fallback to setIsLoggedIn
          if (typeof onAuthLogin === "function") {
            onAuthLogin(token).catch(() => {});
          } else {
            if (token) {
              saveToken(token);
              if (typeof setIsLoggedIn === "function") setIsLoggedIn(true);
            }
          }
        }}
      />
    </div>
  );
}

export default RegisterModal;
