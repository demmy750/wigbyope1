import React from "react";
import "./ContactCTA.css";

const ContactCTA = () => (
  <section
    className="contact-cta"
    aria-labelledby="contact-cta-heading"
    role="region"
  >
    <div className="container">
      <h2 id="contact-cta-heading" tabIndex="0" className="contact-title">
        📞 Schedule Your Personalized Wig Consultation
      </h2>
      <p className="contact-subtitle">
        Experience expert guidance tailored to your unique style and needs. Let us help you find the perfect wig that enhances your confidence and beauty.
      </p>
      <div >
        {/* <a
          href="/book-consultation"
          className="btn btn-primary"
          aria-label="Book a personalized wig consultation"
        >
          Book a Consultation
        </a> */}
        <a
          href="/contact"
          className="btn btn-secondary"
          aria-label="Contact our wig styling experts"
        >
          Contact Us
        </a>
      </div>
    </div>
  </section>
);

export default ContactCTA;