import "./EditProfileData.css";

import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

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

  // if (!isOpen) return null;

  // Here use form variable. This matches consistancy file of this code.
  const isSubmitDisabled = !form.name.trim() || !form.avatar || isSubmitting;

  return (
    <ModalWithForm
      title="Change profile data"
      buttonText={isSubmitting ? "Saving Changes..." : "Save Changes"}
      onClose={() => {
        onClose();
        setError(""); // (fix typo, keep variable singular "error")
      }}
      isOpen={activeModal === "edit_profile"}
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}
    >
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
    </ModalWithForm>
  );
}

export default EditProfileData;
