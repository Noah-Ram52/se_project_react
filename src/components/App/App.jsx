import React, { useEffect, useState } from "react";

import { getWeather, filterWeatherData } from "../../utils/weatherAPI";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  getItems,
  postItems,
  deleteItems,
  getUser,
  updateUser,
} from "../../utils/api";
import * as api from "../../utils/api";
import * as auth from "../../utils/auth";

import "./App.css";
import { APIkey, coordinates } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { defaultClothingItems } from "../../utils/constants";
import RegisterModal from "../RegistrationModal/RegisterModal";
import SigninModal from "../SigninModal/SigninModal";
import EditProfileData from "../EditProfileData/EditProfileData";

function App() {
  // React Router code to hide the header on the login page
  // useLocation hook gives access to the current URL path
  // Then we check if the current path is "/"
  // If it is, we set hideHeader to true, otherwise false
  // This way, the header will be hidden only on the login page

  // State Variable for objects:
  // Recommend to not use an empty object as a default value

  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: false,
  });

  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  // The default 'useState' for activeModal and setActiveModal is "".
  // Meaning that nothing will be submitted in its defaulted state.
  const [activeModal, setActiveModal] = useState("");
  // Create the  array to decicde what happens
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");

  // Function to toggle the temperature unit between Fahrenheit and Celsius

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  // Creates the arrow function
  // In App.jsx look at line 345 for card
  // handleCardClick is the orginal source because it is App.jsx
  const handleCardClick = (card) => {
    setActiveModal("preview");
    // card represents the parameter of setSelectedCard
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  // For the RegistrationModal:
  // For the handleSignup function we set the empty text setActiveModal to
  // "signup". The same is said for activeModal.
  const handleSignUp = () => {
    setActiveModal("signup");
  };

  // For the RegistrationModal:
  // For the handleSignin function we set the empty text setActiveModal
  // to "signin". The same is said for activeModal.
  const handleSignIn = () => {
    setActiveModal("signin");
  };

  const handleProfileData = () => {
    setActiveModal("edit_profile");
  };

  // UseEffect to check for a valid JWT token in localStorage on app mount
  // If a token is found, it calls getUser to validate the token and fetch user data
  // If valid, it sets the current user and marks the user as logged in
  // If invalid or an error occurs, it removes the token and marks the user as logged out
  // This is for the profiile image and name to show up on the profile page
  useEffect(() => {
    const token = (() => {
      try {
        return localStorage.getItem("jwt");
      } catch (e) {
        return null;
      }
    })();
    if (!token) return;
    getUser(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        try {
          localStorage.removeItem("jwt");
        } catch (e) {
          void e;
        }
        setIsLoggedIn(false);
      });
  }, []);

  // Function to handle user profile updates
  // It calls updateUser from api.js and updates the currentUser state
  // This function is passed down to the RegisterModal component for profile updates
  // after registration and to the Profile component for profile edits
  // This ensures that any changes to the user's profile are reflected in the app's state
  // and UI immediately after the update is successful
  const handleUpdateUser = ({ name, avatar }) => {
    return updateUser({ name, avatar }).then((user) => {
      setCurrentUser(user);
      return user;
    });
  };

  // POST request sending the new item to the server
  // and updating the clothingItems state with the new item
  // Connected to the api.js fileF
  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    postItems({ name, imageUrl, weather })
      .then((res) => {
        const item = res?.data ?? res;
        const link =
          item?.imageUrl || item?.link || item?.image || imageUrl || "";
        setClothingItems((prevItems) => [{ ...item, link }, ...prevItems]);
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
      .then((res) => {
        const items = Array.isArray(res.items)
          ? res.items
          : Array.isArray(res?.data)
          ? res.data
          : [];

        setClothingItems(
          items.map((item) => ({
            ...item,
            link: item.imageUrl || item.link || item.image || "",
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

  const navigate = useNavigate();

  // State variable and function to manage user login status
  // eslint-disable-next-line no-console
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // on app start check stored token
  useEffect(() => {
    const token = auth.getToken();
    if (!token) return;
    api
      .getUser(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        auth.removeToken();
        setCurrentUser(null);
        setIsLoggedIn(false);
      });
  }, []);

  // Called after sign-in (or after signup+auto-login)
  function handleAuthLogin(token) {
    if (token) auth.saveToken(token);
    return api
      .getUser(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        return user;
      })
      .catch((err) => {
        auth.removeToken();
        setCurrentUser(null);
        setIsLoggedIn(false);
        throw err;
      });
  }

  function handleLogout() {
    auth.removeToken();
    setCurrentUser(null);
    setIsLoggedIn(false);
    navigate("/");
  }

  // Like & Dislike feature for clothing items

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");
    // Check if this card is not currently liked
    !isLiked
      ? // if so, send a request to add the user's id to the card's likes array
        api
          // the first argument is the card's id
          .addCardLike(id, token)
          .then((updatedCard) => {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? updatedCard : item))
            );
          })
          .catch((err) => console.log(err))
      : // if not, send a request to remove the user's id from the card's likes array
        api
          // the first argument is the card's id
          .removeCardLike(id, token)
          .then((updatedCard) => {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? updatedCard : item))
            );
          })
          .catch(console.error);
  };

  const location = useLocation();

  return (
    // Value to toggle between Fahrenheit and Celsius
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              handleCardClick={handleCardClick}
              weatherData={weatherData}
              // Header will recieve activeModal & setActiveModal
              // And can control modals through the same state as the rest of the app
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              handleSignUp={handleSignUp}
              handleSignIn={handleSignIn}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    setIsLoggedIn={setIsLoggedIn}
                    onAddButtonClick={setActiveModal}
                    handleCardClick={handleCardClick}
                    // Pass clothingItems as a prop to Main
                    // Then go to Profile.jsx and pass it to ClothesSection tag
                    clothingItems={clothingItems}
                    onAuthLogin={handleAuthLogin}
                  />
                }
              />
              {/* ProtectedRoute ensures only logged-in users can access the Profile page */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      // handleCardClick is the orginal source because it is App.jsx
                      // Passes through Profile-->
                      activeModal={activeModal}
                      handleCardClick={handleCardClick}
                      handleProfileData={handleProfileData}
                      // Use the onAddClick prop to open the modal
                      onAddClick={handleAddClick}
                      setIsLoggedIn={setIsLoggedIn}
                      clothingItems={clothingItems}
                      handleUpdateUser={handleUpdateUser}
                      setCurrentUser={setCurrentUser}
                      handleLogout={handleLogout} // Passes handleLogout to Profile.jsx
                    />
                  </ProtectedRoute>
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
            isOpen={activeModal === "preview"}
            activeModal={activeModal}
            card={selectedCard}
            onClose={closeActiveModal}
            onDeleteItem={handleDeleteItem}
          />
          {/* RegisterModal needs to open the sign up modal  */}
          <RegisterModal
            activeModal={activeModal}
            onClose={closeActiveModal} // closes modal
            setIsLoggedIn={setIsLoggedIn}
            onAuthLogin={handleAuthLogin}
            setActiveModal={setActiveModal}
          />
          <SigninModal
            activeModal={activeModal}
            onClose={closeActiveModal}
            setIsLoggedIn={setIsLoggedIn}
            onLogin={handleAuthLogin}
            setActiveModal={setActiveModal}
          />
          <EditProfileData
            activeModal={activeModal}
            currentUser={currentUser}
            onClose={closeActiveModal}
            onUpdateUser={handleUpdateUser}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
