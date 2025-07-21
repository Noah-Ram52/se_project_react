//Importing CSS styles
import "./Profile.css";

// Importing JSX (React) components
import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";

function Profile({ handleCardClick }) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
      </section>
      <section className="profile__clothing-items">
        {/* Pass clothingItems as a prop to ClothesSection, then pass to
        ClothesSection.jsx */}
        {/* Then go to ClothesSection.jsx and use clothingItems prop */}
        <ClothesSection
          handleCardClick={handleCardClick}
          clothingItems={clothingItems}
        />
      </section>
    </div>
  );
}

export default Profile;
