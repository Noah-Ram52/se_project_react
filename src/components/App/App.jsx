import { useEffect, useState } from "react";
import { getWeather, filterWeatherData } from "../../utils/weatherAPI";
import { Routes, Route } from "react-router-dom";
import { getTime, APIkeyTime } from "../../utils/timeAPI";
import { getItems, postItems, deleteItems } from "../../utils/api";

import "./App.css";
import { APIkey, coordinates } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import currentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import { defaultClothingItems } from "../../utils/constants";

function App() {
  // State Variable for objects:
  // Recommend to not use an empty object as a default value

  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: false,
  });

  // Guidelines for using useState:
  // 1. It's useful to make the defualt value the same for later on
  // Example: Setting it to an empty string means
  // You can change it other types of strings

  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");

  // Function to toggle the temperature unit between Fahrenheit and Celsius

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  // POST request sending the new item to the server
  // and updating the clothingItems state with the new item
  // Connected to the api.js fileF
  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    postItems({ name, imageUrl, weather })
      .then((newItem) => {
        // update clothingItems array
        setClothingItems((prevItems) => [
          { ...newItem, link: newItem.imageUrl },
          ...prevItems,
          // {
          //   name: newItem.name,
          //   link: newItem.imageUrl,
          //   weather: newItem.weather,
          // },
        ]);
        // close the modal
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleDeleteItem = (id) => {
    deleteItems(id)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
        closeActiveModal();
      })
      .catch(console.error);
  };

  // useEffect() references the coordinates and API key from constants.js & weatherAPI.js

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  // useEffect() Makes Images disappear

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(
          data.map((item) => ({
            ...item,
            link: item.imageUrl, // ensure link is always present
          }))
        );
      })
      .catch(console.error);
  }, []);

  // Escape key closes the modal. This useEffect listens for the Escape key press
  // and closes the modal if it's open. It also cleans up the event listener when the component unmounts or the modal closes
  // component unmounts or the modal closes. This is a common pattern to handle keyboard events in React

  useEffect(() => {
    if (!activeModal) return; // Exit early if no modal is open

    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        closeActiveModal();
      }
    };

    // Add the event listener when a modal is active
    document.addEventListener("keydown", handleEscClose);

    // Clean up the listener when the modal is closed or the component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]); // Re-run effect when activeModal changes

  return (
    // Value to toggle between Fahrenheit and Celsius
    <currentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className="page">
        <div className="page__content">
          <Header
            handleAddClick={handleAddClick}
            handleCardClick={handleCardClick}
            weatherData={weatherData}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  onAddButtonClick={setActiveModal}
                  handleCardClick={handleCardClick}
                  // Pass clothingItems as a prop to Main
                  // Then go to Profile.jsx and pass it to ClothesSection tag
                  clothingItems={clothingItems}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  handleCardClick={handleCardClick}
                  // Use the onAddClick prop to open the modal
                  onAddClick={handleAddClick}
                  clothingItems={clothingItems}
                />
              }
            />
          </Routes>

          <Footer />
        </div>
        <AddItemModal
          onClose={closeActiveModal}
          isOpen={activeModal === "add-garment"}
          activeModal={activeModal}
          onAddItemModalSubmit={handleAddItemModalSubmit}
        />

        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeActiveModal}
          onDeleteItem={handleDeleteItem}
        />
      </div>
    </currentTemperatureUnitContext.Provider>
  );
}

export default App;
