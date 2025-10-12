import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import "./Header.css";
import logo from "../../assets/Logo.svg";
import avatar from "../../assets/avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import RegisterModal from "../RegistrationModal/RegisterModal";

function Header({ handleAddClick, weatherData, handleSignUp, handleSignIn }) {
  const currentUser = useContext(CurrentUserContext);
  const displayName = currentUser?.name || "Terrence Tegegne";
  const avatarSrc = currentUser?.avatar || null;
  // console.log("Current User in Header:", currentUser);

  // Get current date in "Month Day" format,
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

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

  const [time, setTime] = useState("");

  // Update every second
  setInterval(updateCentralDaylightTime, 1000);

  return (
    <header className="header">
      <Link to="/">
        {" "}
        <img src={logo} alt="Header Logo" className="header__logo" />
      </Link>
      <div className="header__content">
        <div className="header__date-time-and-location">
          {currentDate}, {weatherData.city}, {time}
        </div>

        <div className="header__toggle-switch-and-add-btn">
          {/* Switching between Fahrenheit and Celsius */}
          <ToggleSwitch />
          {/* Set up Log In and Sign Up buttons here */}
          {/* Is there a current user logged in? If so show avatar and name and if
          not show Log In and Sign Up buttons */}
          {/* Displaying weather condition icon */}
          {currentUser ? (
            <>
              <button
                onClick={handleAddClick}
                type="button"
                className="header__add-clothes-btn"
              >
                + Add Clothes
              </button>
              <Link to="/profile" className="header__link">
                <div className="header__user-container">
                  <p className="header__username">{displayName}</p>
                  {avatarSrc ? (
                    // Uses uploaded image if available
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="header__avatar"
                    />
                  ) : (
                    // Otherwise fall back to default image or initials
                    <img
                      src={avatar}
                      alt={displayName}
                      className="header__avatar"
                    />
                  )}
                </div>
              </Link>
            </>
          ) : (
            // Start building sign up and sign in
            <>
              <div className="wtwr__accounts">
                <button
                  className="wtwr__accounts_signup wtwr__accounts"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>{" "}
                <button className="wtwr__accounts" onClick={handleSignIn}>
                  Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
