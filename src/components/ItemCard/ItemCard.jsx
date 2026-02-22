import "./ItemCard.css";
import unlikeIcon from "../../assets/unliked_button.svg";
import likedIcon from "../../assets/liked_button.svg";
import { useState, useEffect } from "react";

function ItemCard({ item, onCardClick, isLiked, handleCardLike, isLoggedIn }) {
  const handleCardClick = () => onCardClick(item);

  // Keep the prop name `isLiked` the same (per your request) but use a local
  // optimistic state so the icon updates immediately on click.
  const [isLikedLocal, setIsLikedLocal] = useState(Boolean(isLiked));

  // Sync local state when parent prop changes (for example after server response)
  useEffect(() => {
    setIsLikedLocal(Boolean(isLiked));
  }, [isLiked]);

  const handleLikeClick = (e) => {
    // Stops the card click handler from also firing when we click the like button
    e.stopPropagation();
    const prev = isLikedLocal;
    // Optimistically flip the UI
    setIsLikedLocal(!prev);

    if (typeof handleCardLike === "function") {
      // Pass the previous state so App decides add/remove correctly
      handleCardLike({ id: item._id, isLiked: prev }).catch((err) => {
        console.error("Like API failed, reverting UI", err);
        setIsLikedLocal(prev);
      });
    } else {
      // No handler: just revert to previous state
      setIsLikedLocal(prev);
    }
  };

  return (
    <li className="card">
      <h2 className="weather__cards-text">
        {item.name}{" "}
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleLikeClick}
            className="weather__cards-like"
          >
            <img
              src={isLikedLocal ? likedIcon : unlikeIcon}
              alt={isLikedLocal ? "liked_button" : "unliked_button"}
              className="weather__cards-liked"
            />
          </button>
        )}
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
