import "./ItemCard.css";
import unlikeIcon from "../../assets/unliked_button.svg";
import likedIcon from "../../assets/liked_button.svg";

function ItemCard({ item, onCardClick }) {
  const handleCardClick = () => {
    onCardClick(item);
  };

  return (
    // <li className="card">
    //   <h2 className="weather__cards-text">{item.name}</h2>
    //   <img
    //     onClick={handleCardClick}
    //     src={item.link}
    //     alt={item.name}
    //     className="weather__images"
    //   />
    //   <button>
    //     <img
    //       src={unlikeIcon}
    //       alt="unliked_button"
    //       className="weather__cards-liked"
    //     />
    //   </button>
    // </li>
    <li className="card">
      <h2 className="weather__cards-text">
        {item.name}{" "}
        <button>
          <img
            src={unlikeIcon}
            alt="unliked_button"
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
