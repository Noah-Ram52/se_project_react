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

  // function handleChange(e) {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // }

  return (
    <div className="registration">
      {/* Header */}
      <header className="header">
        <Link to="/">
          <img src={logo} alt="Header Logo" className="header__logo" />
        </Link>

        <div className="header__content">
          <div className="header__date-time-and-location">
            {currentDate}, {weatherData.city}, {time}
          </div>

          <div className="header__toggle-switch-and-add-btn">
            <ToggleSwitch />
            <button
              type="button"
              className="registration__btn-signup"
              // Clicking the "Sign Up" button sets it to true
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="registration__btn-login"
              onClick={() => setShowSignin(true)}
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      <WeatherCard weatherData={weatherData} />

      <section className="cards">
        <p className="weather__text">
          Today is{" "}
          {currentTemperatureUnit === "F"
            ? weatherData.temp.F
            : weatherData.temp.C}{" "}
          &deg; {currentTemperatureUnit} / You may want to wear:
        </p>
        <ul className="cards__list">
          {clothingItems
            .filter((item) => item.weather === weatherData.type)
            .map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onCardClick={handleCardClick}
              />
            ))}
        </ul>
      </section>

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
                  disabled={isSubmitting}
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
