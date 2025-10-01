import "./ModalWithForm.css";
import closeButton from "../../assets/x_modal_button.svg";

function ModalWithForm({
  children,
  buttonText,
  title,
  isOpen,
  onClose,
  onSubmit,
  isSubmitDisabled = false,
}) {
  return (
    <div className={`modal ${isOpen ? "modal modal_opened" : "modal"}`}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button onClick={onClose} type="button" className="modal__close">
          <img src={closeButton} alt="Close__Button" />
        </button>
        <form onSubmit={onSubmit} className="modal__form">
          {children}
          <button
            type="submit"
            className="modal__submit"
            disabled={isSubmitDisabled}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
