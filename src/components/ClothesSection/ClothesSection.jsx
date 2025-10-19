// May need to redo this file

import "./ClothesSection.css";

import ItemCard from "../ItemCard/ItemCard";

// Pass clothingItems as a prop to ClothesSection
function ClothesSection({
  handleCardClick,
  onAddClick,
  clothingItems = [],
  handleCardLike,
  onCardLike,
  currentUser,
}) {
  return (
    <div className="clothes-section">
      <div>
        <div className="clothes-section__items">
          <p>Your Items</p>
          <button
            className="clothes-section__adding_items"
            // This button will open the modal to add a new item
            onClick={onAddClick}
          >
            + Add New
          </button>
        </div>
        <ul className="clothes-section__cards">
          {/* Instead of using defaultClothingItems.map .... I should use
          clothingItems.map ... */}
          {clothingItems.map((item) => {
            return (
              <ItemCard
                key={item._id}
                item={item}
                // Passes a prop from parent (Profile) to each ItemCard
                onCardClick={handleCardClick}
                handleCardLike={handleCardLike}
                onCardLike={onCardLike}
                isLiked={item.isLiked}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ClothesSection;
