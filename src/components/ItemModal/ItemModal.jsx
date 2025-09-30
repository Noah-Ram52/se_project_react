import { useEffect, useState, useContext } from "react";
import "./ItemModal.css";
import closeButton from "../../assets/close__weather-image.svg";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, onClose, card, onDeleteItem }) {
  const [isVisible, setIsVisible] = useState(false);
  const currentUser = useContext(CurrentUserContext);

  // Handle fade-in and fade-out
  useEffect(() => {
    if (activeModal === "preview") {
      setIsVisible(true);
    } else if (isVisible) {
      // Wait for fade-out animation before unmounting
      const timeout = setTimeout(() => setIsVisible(false), 300); // 300ms matches CSS transition
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line no-console
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
          src={card?.link || card?.image || ""}
          alt={card?.name || ""}
          className="modal__image"
        />

        <div className="modal__footer">
          <h2 className="modal__caption">{card?.name || ""}</h2>
          {(() => {
            // determine ownership defensively; server may return owner as id string or object
            const ownerId =
              card &&
              (typeof card.owner === "string"
                ? card.owner
                : card.owner?._id || card.ownerId || card.userId);
            const isOwn = Boolean(
              currentUser &&
                ownerId &&
                currentUser._id &&
                ownerId === currentUser._id
            );
            return isOwn ? (
              <button
                className="modal__delete_item"
                onClick={handleDelete}
                type="button"
              >
                Delete item
              </button>
            ) : null;
          })()}
          <p className="modal__weather">Weather: {card?.weather || ""}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
