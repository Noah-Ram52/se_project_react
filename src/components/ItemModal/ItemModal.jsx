import "./ItemModal.css";
import closeButton from "../../assets/close__weather-image.svg";

function ItemModal({ activeModal, onClose, card, onDeleteItem }) {
  // DELETE request handler
  console.log("Deleting card:", card);
  const handleDelete = () => {
    if (card && card._id) {
      onDeleteItem(card._id);
    } else {
      onClose(); // fallback: just close if no id
    }
  };

  return (
    <div className={`modal ${activeModal === "preview" && "modal_opened"}`}>
      <div className="modal__content modal__content_type_image">
        <button onClick={handleDelete} type="button" className="modal__close">
          <img src={closeButton} alt="Close__Button" />
        </button>

        <img
          src={card.link}
          alt="modal__preview_image"
          className="modal__image"
        />

        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
