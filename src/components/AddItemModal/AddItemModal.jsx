import "./AddItemModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useState, useEffect } from "react";

export default function AddItemModal({
  onClose,
  isOpen,
  onAddItemModalSubmit,
}) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [weather, setWeather] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleWeatherChange = (e) => {
    setWeather(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // update clothingItems array
    onAddItemModalSubmit({ name, imageUrl, weather });
    // empty the inputs
    // setName("");
    // setimageUrl("");
    // setWeather("");
  };

  // useEffect needs to imported from react. Shown on line 3.
  // useEffect has to be outside of handleSubmit to work properly
  // For useEffect to work properly, it should be outside of handleSubmit
  //  Also you need to reset the state when the modal opens

  useEffect(() => {
    setName("");
    setImageUrl("");
    setWeather("");
  }, [isOpen]); // triggered whenever the modal opens

  const isSubmitDisabled = !name.trim() || !imageUrl.trim() || !weather;

  return (
    <ModalWithForm
      title="New Garment"
      buttonText="Add Garment"
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}
    >
      {" "}
      <label htmlFor="name" className="modal__label">
        Name{" "}
        <input
          placeholder="Name"
          type="text"
          className="modal__input"
          id="name"
          onChange={handleNameChange}
          value={name}
          required
        />
      </label>
      <label htmlFor="imageUrl" className="modal__label ">
        Image{" "}
        <input
          type="text"
          className="modal__input"
          id="imageUrl"
          placeholder="Image URL"
          onChange={handleImageUrlChange}
          value={imageUrl}
          required
        />
      </label>
      <fieldset className="modal__radio-buttons">
        <legend className="modal__legend">Select the weather type:</legend>
        <label
          htmlFor="hot"
          className="modal__label modal__label_type_radio modal__label_clothes"
        >
          <input
            id="hot"
            type="radio"
            className="modal__radio-input"
            name="weather"
            value="hot"
            onChange={handleWeatherChange}
            checked={weather === "hot"}
          />
          Hot
        </label>
        <label
          htmlFor="warm"
          className="modal__label modal__label_type_radio modal__label_clothes"
        >
          <input
            id="warm"
            type="radio"
            className="modal__radio-input"
            name="weather"
            value="warm"
            onChange={handleWeatherChange}
            checked={weather === "warm"}
          />
          Warm
        </label>
        <label
          htmlFor="cold"
          className="modal__label modal__label_type_radio modal__label_clothes"
        >
          <input
            id="cold"
            type="radio"
            className="modal__radio-input"
            name="weather"
            value="cold"
            checked={weather === "cold"}
            onChange={handleWeatherChange}
          />
          Cold
        </label>
      </fieldset>{" "}
    </ModalWithForm>
  );
}
