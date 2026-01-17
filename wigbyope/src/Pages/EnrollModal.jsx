import React from "react";
import "./EnrollModal.css";

function EnrollModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="enroll-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enroll-modal-title"
      aria-describedby="enroll-modal-description"
    >
      <div className="enroll-modal-content">
        <button
          onClick={onClose}
          aria-label="Close enrollment form"
          className="enroll-modal-close-btn"
        >
          &times;
        </button>
        <h2 id="enroll-modal-title" className="enroll-modal-title">
          Enroll Now
        </h2>
        <p id="enroll-modal-description" className="enroll-modal-description">
          Please fill out the form below to start your journey with us. We will get back to you shortly with enrollment details.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for enrolling! We will contact you soon.");
            onClose();
          }}
          className="enroll-modal-form"
        >
          <label htmlFor="name" className="enroll-modal-label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="enroll-modal-input"
          />

          <label htmlFor="email" className="enroll-modal-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="enroll-modal-input"
          />

          <label htmlFor="package" className="enroll-modal-label">
            Select Training Package
          </label>
          <select
            id="package"
            name="package"
            required
            defaultValue=""
            className="enroll-modal-select"
          >
            <option value="" disabled>
              -- Choose a package --
            </option>
            <option value="online">Online Classes</option>
            <option value="in-person">In-Person Classes</option>
            <option value="one-on-one">One-on-One Coaching</option>
          </select>

          <button type="submit" className="enroll-modal-submit-btn">
            Submit Enrollment
          </button>
        </form>
      </div>
    </div>
  );
}

export default EnrollModal;