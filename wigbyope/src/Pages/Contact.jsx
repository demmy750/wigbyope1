import React, { useState } from "react";
import styles from "./Contact.module.css";

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com/yourprofile",
    label: "Instagram",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="instagram"
        className={styles.socialIcon}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          fill="currentColor"
          d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9 0 63.6 51.3 114.9 114.9 114.9 63.6 0 114.9-51.3 114.9-114.9 0-63.6-51.3-114.9-114.9-114.9zm0 190.7c-41.9 0-75.8-33.9-75.8-75.8 0-41.9 33.9-75.8 75.8-75.8 41.9 0 75.8 33.9 75.8 75.8 0 41.9-33.9 75.8-75.8 75.8zm146.4-194.3c0 14.9-12 26.9-26.9 26.9-14.9 0-26.9-12-26.9-26.9s12-26.9 26.9-26.9c14.9 0 26.9 12 26.9 26.9zm76.1 27.2c-.1-54.6-44.4-98.9-99-99-27.1-.1-54.2 10.7-73.9 30.4-19.7 19.7-30.5 46.8-30.4 73.9.1 54.6 44.4 98.9 99 99 27.1.1 54.2-10.7 73.9-30.4 19.7-19.7 30.5-46.8 30.4-73.9z"
        ></path>
      </svg>
    ),
  },
  {
    href: "https://tiktok.com/@yourprofile",
    label: "TikTok",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="tiktok"
        className={styles.socialIcon}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          fill="currentColor"
          d="M448,209.91a210.15,210.15,0,0,1-121.6-38.1v146.3a110.4,110.4,0,1,1-110.4-110.4V0h44.8a165.6,165.6,0,0,0,110.4,110.4Z"
        ></path>
      </svg>
    ),
  },
  {
    href: "https://wa.me/1234567890",
    label: "WhatsApp",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="whatsapp"
        className={styles.socialIcon}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          fill="currentColor"
          d="M380.9 97.1C339-2.3 256-32 176.1 7.3 96.2 46.6 56.1 129.6 97.1 230.5c7.3 17.3 18.3 33.3 32.7 46.7L64 448l170.8-65.8c13.4 9.3 29.3 16.3 46.7 18.3 100.9 41 183.9 1 223.2-78.9 40.3-80.9 10.6-163.9-78.9-203.2zM224 400c-44.2 0-80-35.8-80-80 0-44.2 35.8-80 80-80 44.2 0 80 35.8 80 80 0 44.2-35.8 80-80 80z"
        ></path>
      </svg>
    ),
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    if (!validateEmail(email)) {
      setFormStatus({ type: "error", message: "Please enter a valid email." });
      return;
    }
    // Simulate form submission
    setFormStatus({ type: "success", message: "Thank you! We'll get back to you soon." });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className={styles.contactPage}>
      <header className={styles.hero}>
        <h1>Contact Us</h1>
        <p>Reach out for wig & braid training, consultations, or any questions.</p>
      </header>

      <section className={styles.contentGrid}>
        {/* Contact Form */}
        <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
          <h2>Send Us a Message</h2>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Your message..."
            value={formData.message}
            onChange={handleChange}
            required
          />

          {formStatus && (
            <p
              className={
                formStatus.type === "error"
                  ? styles.errorMessage
                  : styles.successMessage
              }
              role="alert"
            >
              {formStatus.message}
            </p>
          )}

          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>

        {/* Business Info & Map */}
        <aside className={styles.infoSection}>
          <div className={styles.businessInfo}>
            <h2>Business Information</h2>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+15551234567" className={styles.link}>
                (555) 123-4567
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@wigbyope.com" className={styles.link}>
                info@wigbyope.com
              </a>
            </p>
            <p>
              <strong>Address:</strong> 123 Beauty Lane, San Francisco, CA 94102
            </p>
          </div>

          {/* <div className={styles.mapContainer} aria-label="Google Map location">
            <iframe
              title="WigByOpe Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d-122.41941578468136!3d37.77492927975911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858130dcf927a9%3A0x757de38a6b50ac8f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1615439611953!5m2!1sen!2sus"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div> */}

          <div className={styles.socialMedia}>
            <h2>Follow Us</h2>
            <nav aria-label="Social media links" className={styles.socialLinks}>
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={styles.socialLink}
                >
                  {icon}
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.cta}>
            <button
              onClick={() => alert("Booking feature coming soon!")}
              className={styles.ctaButton}
              aria-label="Book a Consultation"
            >
              Book a Consultation
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}