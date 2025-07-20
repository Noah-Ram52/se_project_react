// May need to redo this file

import "./ClothesSection.css";

import ItemCard from "../ItemCard/ItemCard";
import { defaultClothingItems } from "../../utils/constants";

function ClothesSection({ handleCardClick }) {
  return (
    <div className="clothes-section">
      <div>
        <div className="clothes-section__items">
          <p>Your Items</p>
          <button className="clothes-section__adding_items">+ Add New</button>
        </div>
        <ul className="clothes-section__cards">
          {defaultClothingItems.map((item) => {
            return (
              <ItemCard
                key={item._id}
                item={item}
                // TODO - pass as prop
                handleCardClick={handleCardClick}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ClothesSection;
