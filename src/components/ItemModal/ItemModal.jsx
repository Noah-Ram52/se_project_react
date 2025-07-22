import { useEffect, useState } from "react";
import "./ItemModal.css";
import closeButton from "../../assets/close__weather-image.svg";

function ItemModal({ activeModal, onClose, card, onDeleteItem }) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle fade-in and fade-out
  useEffect(() => {
    if (activeModal === "preview") {
      setIsVisible(true);
    } else if (isVisible) {
      // Wait for fade-out animation before unmounting
      const timeout = setTimeout(() => setIsVisible(false), 300); // 300ms matches CSS transition
      return () => clearTimeout(timeout);
    }
  }, [activeModal]);

  if (!isVisible && activeModal !== "preview") return null;

  // DELETE request handler

  const handleDelete = () => {
    if (card && card._id) {
      onDeleteItem(card._id);
    } else {
      onClose(); // fallback: just close if no id
    }
  };

  return (
    <div
      className={`modal ${activeModal === "preview" && "modal_opened"} `}
      onClick={onClose}
    >
      <div
        className="modal__content modal__content_type_image"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} type="button" className="modal__close">
          <img src={closeButton} alt="Close__Button" />
        </button>

        <img
          src={card.link}
          alt="modal__preview_image"
          className="modal__image"
        />

        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <button
            className="modal__delete_item"
            onClick={handleDelete}
            type="button"
          >
            Delete item
          </button>
          <p className="modal__weather">Weather: {card.weather}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
