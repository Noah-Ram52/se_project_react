import "./SideBar.css";
import avatarWTWR from "../../assets/avatar.svg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function SideBar({ setIsLoggedIn, onEditProfile }) {
  const navigate = useNavigate();
  const currentUser = useContext(CurrentUserContext);

  // Handles user logging out

  function handleLogout() {
    try {
      localStorage.removeItem("jwt");
    } catch (e) {
      void e;
    }
    if (typeof setIsLoggedIn === "function") setIsLoggedIn(false);
    navigate("/");
  }

  const displayName = currentUser?.name || "Terrence Tegegne";
  const avatarSrc = currentUser?.avatar || null;

  return (
    <aside className="sidebar">
      <div className="sidebar__profile">
        {/* <img className="sidebar__avatar" src={avatarWTWR} alt="User Avatar" /> */}
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
              onClick={() => {
                console.debug("SideBar: Change profile data clicked");
                if (typeof onEditProfile === "function") onEditProfile();
              }}
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
