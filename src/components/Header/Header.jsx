import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import "./Header.css";
import logo from "../../assets/Logo.svg";
import avatar from "../../assets/avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({ handleAddClick, weatherData }) {
  const currentUser = useContext(CurrentUserContext);
  const displayName = currentUser?.name || "Terrence Tegegne";
  const avatarSrc = currentUser?.avatar || null;

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

          {/* Displaying weather condition icon */}
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
              <img
                src={avatar}
                alt="Terrence Tegegne"
                className="header__avatar"
              />

              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="header__avatar"
                />
              ) : (
                // <div className="header__avatar header__avatar--initials">
                //   {(displayName[0] || "T").toUpperCase()}
                // </div>
                <div className="">
                  {/* {(displayName[0] || "T").toUpperCase()} */}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
