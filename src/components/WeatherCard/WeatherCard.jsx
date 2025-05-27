import "./WeatherCard.css";
import Sunny from "../../assets/Sunny_Weather.svg";

function WeatherCard() {
  return (
    <section className="weather-card">
      <p className="weather-card__info">75 &deg; F</p>
      <img src={Sunny} alt="Sunny" className="weather-card__image" />
    </section>
  );
}

export default WeatherCard;
