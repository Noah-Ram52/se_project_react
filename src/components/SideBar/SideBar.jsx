import "./SideBar.css";
import avatarWTWR from "../../assets/avatar.svg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function SideBar({ onEditProfile, handleLogout, handleProfileData }) {
  const navigate = useNavigate();
  const currentUser = useContext(CurrentUserContext);

  const displayName = currentUser?.name || "Terrence Tegegne";
  const avatarSrc = currentUser?.avatar || null;

  return (
    <aside className="sidebar">
      <div className="sidebar__profile">
        {avatarSrc ? (
          <img className="sidebar__avatar" src={avatarSrc} alt={displayName} />
        ) : (
          <div className="sidebar__avatar sidebar__avatar--initials">
            {(displayName[0] || "T").toUpperCase()}
          </div>
        )}
        <h2 className="sidebar__name">{displayName}</h2>
      </div>

      <nav className="sidebar__nav">
        <ul>
          <li>
            <button
              type="button"
              className="sidebar__link_profile"
              onClick={handleProfileData}
            >
              Change profile data
            </button>
          </li>
          <li>
            <button className="sidebar__link_logout" onClick={handleLogout}>
              Log out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideBar;
