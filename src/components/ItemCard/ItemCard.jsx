import { useState } from "react";
import "./ItemCard.css";
import unlikeIcon from "../../assets/unliked_button.svg";
import likedIcon from "../../assets/liked_button.svg";

function ItemCard({ item, onCardClick }) {
  const [isLiked, setIsLiked] = useState(false);

  // In ItemCard we are displaying the item, but redirect to
  // App.jsx line to see what happens when interacted
  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation(); // prevent triggering card click
    setIsLiked((prev) => !prev);
  };

  return (
    <li className="card">
      <h2 className="weather__cards-text">
        {item.name}{" "}
        <button
          type="checkbox"
          onClick={handleLikeClick}
          className="weather__cards-like"
        >
          <img
            src={isLiked ? likedIcon : unlikeIcon}
            alt={isLiked ? "liked_button" : "unliked_button"}
            className="weather__cards-liked"
          />
        </button>
      </h2>

      <img
        onClick={handleCardClick}
        src={item.link}
        alt={item.name}
        className="weather__images"
      />
    </li>
  );
}

export default ItemCard;
