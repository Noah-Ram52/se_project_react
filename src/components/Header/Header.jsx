import "./Header.css";
import logo from "../../assets/Logo.svg";
import avatar from "../../assets/avatar.svg";

function Header({ handleAddClick }) {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="header__logo" />
      <p className="header__date-and-location">Date, Location</p>
      <button
        onClick={handleAddClick}
        type="button"
        className="header__add-clothes-btn"
      >
        + Add Clothes
      </button>
      <div className="header__user-container">
        <p className="header__username">Terrence Tegegne</p>
        <img src={avatar} alt="Terrence Tegegne" className="header__avatar" />
      </div>
    </header>
  );
}

export default Header;
