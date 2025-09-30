import "./EditProfileData.css";

import { useState, useEffect } from "react";
import closeButton from "../../assets/x_modal_button.svg";

function EditProfileData({ isOpen, onClose, onUpdateUser, currentUser }) {
  const [form, setForm] = useState({ name: "", avatar: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser)
      setForm({
        name: currentUser.name || "",
        avatar: currentUser.avatar || "",
      });
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (typeof onUpdateUser === "function") {
        await onUpdateUser({
          name: form.name.trim(),
          avatar: form.avatar.trim(),
        });
      }
      onClose();
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-modal__content">
        <button className="edit-profile-modal__close" onClick={onClose}>
          <img
            src={closeButton}
            alt="Close_Profile_Data"
            className="close__profile-form"
          />
        </button>
        <h3>Change profile data</h3>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <label>
            Name *
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Avatar *
            <input name="avatar" value={form.avatar} onChange={handleChange} />
          </label>
          {error && <div className="edit-profile-form__error">{error}</div>}
          <div className="edit-profile-form__actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileData;
