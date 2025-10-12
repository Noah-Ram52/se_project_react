import "./EditProfileData.css";

import { useState, useEffect } from "react";
import closeButton from "../../assets/x_modal_button.svg";

function EditProfileData({ activeModal, onClose, onUpdateUser, currentUser }) {
  const [form, setForm] = useState({ name: "", avatar: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = activeModal === "edit_profile";

  useEffect(() => {
    if (isOpen && currentUser) {
      setForm({
        name: currentUser.name || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser, isOpen]);

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

  if (!isOpen) return null;

  return (
    <div
      className={`modal ${
        activeModal === "edit_profile" ? "modal_opened" : ""
      } `}
    >
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>
          <img src={closeButton} alt="Close_Profile_Data" className="" />
        </button>
        <h3 className="modal__title">Change profile data</h3>
        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="modal__label">
            Name *
            <input
              className="modal__label_account_info modal__input_text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label className="modal__label">
            Avatar *
            <input
              className="modal__label_account_info modal__input_text"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
            />
          </label>
          {error && <div className="modal__error">{error}</div>}
          <div>
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
