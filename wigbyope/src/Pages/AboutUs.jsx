import React from "react";
import "./AboutUs.css";
import aboutImg from "../assets/training.jpeg"; // add your actual image here

const AboutUs = () => (
  <section className="about-section" aria-labelledby="about-heading" role="region">
    <div className="about-content">
      <div className="about-text">
        <h2 id="about-heading" tabIndex="0" className="about-title">
          About Us
        </h2>
        <h3 className="about-subtitle">💇 Expert Styling Team</h3>
        <p className="about-description">
          At our wig salon, we are passionate about delivering premium-quality wigs that combine luxury, comfort, and unmatched style. 
          With years of expertise in crafting personalized solutions, our dedicated team is committed to helping you look and feel fabulous every day.
        </p>
        <p className="about-description">
          Whether you're seeking a flawless everyday look or a glamorous transformation, our salon is your trusted partner in elegance and self-expression. 
          Discover the difference with our tailored approach to wig styling and care.
        </p>
        <a href="/about" className="about-btn" aria-label="Meet our expert team">
          Meet the Team ✨
        </a>
      </div>
      <div className="about-image" aria-hidden="true">
        <img
          src={aboutImg}
          alt="Interior of a modern wig salon with elegant displays and styling stations"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
);

export default AboutUs;
