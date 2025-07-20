import "./Header.css";
import logo from "../../assets/Logo.svg";
import avatar from "../../assets/avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { useState } from "react";
import { Link } from "react-router-dom";

function Header({ handleAddClick, weatherData }) {
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
      <Link to="/se_project_react">
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
          <Link to="/se_project_react/profile" className="header__link">
            <div className="header__user-container">
              <p className="header__username">Terrence Tegegne</p>
              <img
                src={avatar}
                alt="Terrence Tegegne"
                className="header__avatar"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
