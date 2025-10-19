import "./ItemCard.css";
import unlikeIcon from "../../assets/unliked_button.svg";
import likedIcon from "../../assets/liked_button.svg";

function ItemCard({ item, onCardClick, isLiked, handleCardLike, isLoggedIn }) {
  // In ItemCard we are displaying the item, but redirect to
  // App.jsx line to see what happens when interacted
  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    // setIsLiked((prev) => !prev);
    handleCardLike({ id: item._id, isLiked }); // Use onCardLike here
  };

  return (
    <li className="card">
      <h2 className="weather__cards-text">
        {item.name}{" "}
        {/* Only shows liked button when logged in using isLoggedIn */}
        {isLoggedIn && (
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
