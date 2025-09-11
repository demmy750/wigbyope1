import React from "react";
import "./TrainingPreview.css";
import trainingImg from "../assets/training.jpeg";

const TrainingPreview = () => (
  <section
    className="training-preview"
    aria-labelledby="training-preview-heading"
    role="region"
  >
    <div className="training-content">
      <div className="training-text">
        <h2 id="training-preview-heading" tabIndex="0" className="training-title">
          🎓 Training Preview
        </h2>
        <p className="training-description">
          Unlock the secrets of professional wig styling with our expert-led training sessions. 
          Master advanced techniques to create flawless, stunning looks tailored to your unique style.
        </p>
        <a
          href="/training"
          className="training-btn"
          aria-label="Learn more about wig styling training"
        >
          Start Training 🚀
        </a>
      </div>
      <div className="training-image" aria-hidden="true">
        <img
          src={trainingImg}
          alt="Instructor demonstrating wig styling techniques during a training session"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
);

export default TrainingPreview;
