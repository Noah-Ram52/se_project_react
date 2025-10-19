// CSS styles
import "./Profile.css";

// Importing JSX (React) components
import { useState, useContext } from "react";
import EditProfileData from "../EditProfileData/EditProfileData";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";

function Profile({
  activeModal,
  handleCardClick,
  handleProfileData, // comes from App.jsx
  clothingItems,
  onAddClick,
  setIsLoggedIn,
  handleUpdateUser,
  handleLogout,
  handleCardLike,
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar
          activeModal={activeModal}
          handleProfileData={handleProfileData}
          setIsLoggedIn={setIsLoggedIn}
          onEditProfile={() => setIsEditOpen(true)}
          handleLogout={handleLogout} // Passes handleLogout to Sidebar.jsx
        />
      </section>
      {isEditOpen && (
        <EditProfileData
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onUpdateUser={async (data) => {
            // pass to App handler if provided, then close on success
            if (typeof handleUpdateUser === "function") {
              await handleUpdateUser(data).catch((err) => {
                // keep modal open on error; EditProfileData should also show errors
                console.error("update user failed", err);
                throw err;
              });
            }
            setIsEditOpen(false);
          }}
          currentUser={currentUser}
        />
      )}
      <section className="profile__clothing-items">
        {/* Pass clothingItems as a prop to ClothesSection, then pass to
        ClothesSection.jsx */}
        {/* Then go to ClothesSection.jsx and use clothingItems prop */}
        <ClothesSection
          // Profile gets handleCardClick App.jsx (the parent) and
          // Passes it down it down to ClothesSection
          handleCardClick={handleCardClick}
          clothingItems={clothingItems}
          onAddClick={onAddClick}
          handleCardLike={handleCardLike}
          // onCardLike={handleCardLike}
        />
      </section>
    </div>
  );
}

export default Profile;
