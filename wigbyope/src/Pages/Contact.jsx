// import React, { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import styles from "./Contact.module.css";

// const SOCIAL_LINKS = [
//   {
//     href: "https://instagram.com/yourprofile",
//     label: "Instagram",
//     icon: (
//       <svg
//         aria-hidden="true"
//         focusable="false"
//         data-prefix="fab"
//         data-icon="instagram"
//         className={styles.socialIcon}
//         role="img"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//       >
//         <path
//           fill="currentColor"
//           d="M224,202.66A53.34,53.34,0,1,0,277.36,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.41-30.41c-21-8.29-71-6.43-94.3-6.43s-73.25-1.86-94.31,6.43a54,54,0,0,0-30.41,30.41c-8.28,21-6.43,71.05-6.43,94.33S91,329.26,99.32,350.33a54,54,0,0,0,30.41,30.41c21,8.29,71,6.43,94.31,6.43s73.24,1.86,94.3-6.43a54,54,0,0,0,30.41-30.41c8.35-21,6.43-71.05,6.43-94.33S357,182.74,348.75,161.67ZM224,338a82,82,0,1,1,82-82A81.9,81.9,0,0,1,224,338Zm85.38-148.3a19.14,19.14,0,1,1,19.13-19.14A19.1,19.1,0,0,1,309.42,189.74ZM400,32H48A48,48,0,0,0,0,80V432a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V80A48,48,0,0,0,400,32ZM382.88,322c2,63.18-47.59,113.25-109.76,111.21-62.2-2-109.77-52.05-109.77-115.23S210.88,198,273.08,200C335.25,202,380.88,258.82,382.88,322Z"
//         ></path>
//       </svg>
//     ),
//   },
//   {
//     href: "https://tiktok.com/@yourprofile",
//     label: "TikTok",
//     icon: (
//       <svg
//         aria-hidden="true"
//         focusable="false"
//         data-prefix="fab"
//         data-icon="tiktok"
//         className={styles.socialIcon}
//         role="img"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//       >
//         <path
//           fill="currentColor"
//           d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.87,22.17,122.18,122.18,0,0,0,58.91,100.06A123.16,123.16,0,0,0,461,130.91a126.48,126.48,0,0,0,15.09,2.16,209.05,209.05,0,0,1,23.84,1.64c0-.12,0-.25,0-.37V36a21.87,21.87,0,0,0,12.09,20.54A49.21,49.21,0,0,0,528,64V317.84A146.39,146.39,0,0,0,576,256V192A209.5,209.5,0,0,0,448,209.91Z"
//         ></path>
//       </svg>
//     ),
//   },
//   {
//     href: "https://wa.me/1234567890",
//     label: "WhatsApp",
//     icon: (
//       <svg
//         aria-hidden="true"
//         focusable="false"
//         data-prefix="fab"
//         data-icon="whatsapp"
//         className={styles.socialIcon}
//         role="img"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//       >
//         <path
//           fill="currentColor"
//           d="M380.9 97.1C339-2.3 256-32 176.1 7.3 96.2 46.6 56.1 129.6 97.1 230.5c7.3 17.3 18.3 33.3 32.7 46.7L64 448l170.8-65.8c13.4 9.3 29.3 16.3 46.7 18.3 100.9 41 183.9 1 223.2-78.9 40.3-80.9 10.6-163.9-78.9-203.2zM224 400c-44.2 0-80-35.8-80-80 0-44.2 35.8-80 80-80 44.2 0 80 35.8 80 80 0 44.2-35.8 80-80 80z"
//         ></path>
//       </svg>
//     ),
//   },
// ];

// export default function Contact() {
//   const [formData, setFormData] = useState({ name: "", email: "", message: "" });
//   const [formStatus, setFormStatus] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const validateEmail = (email) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, email, message } = formData;
//     if (!name.trim() || !email.trim() || !message.trim()) {
//       setFormStatus({ type: "error", message: "Please fill in all fields." });
//       return;
//     }
//     if (!validateEmail(email)) {
//       setFormStatus({ type: "error", message: "Please enter a valid email." });
//       return;
//     }
//     setIsSubmitting(true);
//     setFormStatus(null);
//     try {
//       // Replace with your actual API endpoint for staging
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, message }),
//       });
//       if (response.ok) {
//         toast.success("Thank you! Your message has been sent. We'll get back to you soon.");
//         setFormData({ name: "", email: "", message: "" });
//       } else {
//         throw new Error('Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast.error("Sorry, there was an error sending your message. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBookConsultation = () => {
//     toast.info("Our consultation booking feature is coming soon! Stay tuned for updates.", {
//       position: "top-center",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   return (
//     <main className={styles.contactPage}>
//       <header className={styles.hero}>
//         <h1>Contact Us</h1>
//         <p>Reach out for wig & braid training, consultations, or any questions.</p>
//       </header>

//       <section className={styles.contentGrid}>
//         {/* Contact Form */}
//         <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
//           <h2>Send Us a Message</h2>
//           <label htmlFor="name">Name</label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             placeholder="Your Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />

//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="you@example.com"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <label htmlFor="message">Message</label>
//           <textarea
//             id="message"
//             name="message"
//             rows="5"
//             placeholder="Your message..."
//             value={formData.message}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
//             {isSubmitting ? "Sending..." : "Send Message"}
//           </button>
//         </form>

//         {/* Business Info & Map */}
//         <aside className={styles.infoSection}>
//           <div className={styles.businessInfo}>
//             <h2>Business Information</h2>
//             <p>
//               <strong>Phone:</strong>{" "}
//               <a href="tel:+15551234567" className={styles.link}>
//                 (555) 123-4567
//               </a>
//             </p>
//             <p>
//               <strong>Email:</strong>{" "}
//               <a href="mailto:info@wigbyope.com" className={styles.link}>
//                 wigbyope@gmail.com
//               </a>
//             </p>
//             <p>
//               <strong>Address:</strong> 123 Beauty Lane, San Francisco, CA 94102
//             </p>
//           </div>

//           {/* <div className={styles.mapContainer} aria-label="Google Map location">
//             <iframe
//               title="WigByOpe Location"
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d-122.41941578468136!3d37.77492927975911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858130dcf927a9%3A0x757de38a6b50ac8f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1615439611953!5m2!1sen!2sus"
//               width="100%"
//               height="250"
//               style={{ border: 0 }}
//               allowFullScreen=""
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             ></iframe>
//           </div> */}

//           <div className={styles.socialMedia}>
//             <h2>Follow Us</h2>
//             <nav aria-label="Social media links" className={styles.socialLinks}>
//               {SOCIAL_LINKS.map(({ href, label, icon }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={label}
//                   className={styles.socialLink}
//                 >
//                   {icon}
//                 </a>
//               ))}
//             </nav>
//           </div>

//           <div className={styles.cta}>
//             <button
//               onClick={handleBookConsultation}
//               className={styles.ctaButton}
//               aria-label="Book a Consultation"
//             >
//               Book a Consultation
//             </button>
//           </div>
//         </aside>
//       </section>

//       <ToastContainer />
//     </main>
//   );
// }


import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Contact.module.css";

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com/yourprofile",
    label: "Instagram",
    icon: <i className={`fab fa-instagram ${styles.socialIcon}`} aria-hidden="true"></i>,
  },
  {
    href: "https://tiktok.com/@yourprofile",
    label: "TikTok",
    icon: <i className={`fab fa-tiktok ${styles.socialIcon}`} aria-hidden="true"></i>,
  },
  {
    href: "https://wa.me/1234567890",
    label: "WhatsApp",
    icon: <i className={`fab fa-whatsapp ${styles.socialIcon}`} aria-hidden="true"></i>,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
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
    setIsSubmitting(true);
    setFormStatus(null);
    try {
      // Replace with your actual API endpoint for staging
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (response.ok) {
        toast.success("Thank you! Your message has been sent. We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Sorry, there was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookConsultation = () => {
    toast.info("Our consultation booking feature is coming soon! Stay tuned for updates.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
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
                wigbyope@gmail.com
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
              onClick={handleBookConsultation}
              className={styles.ctaButton}
              aria-label="Book a Consultation"
            >
              Book a Consultation
            </button>
          </div>
        </aside>
      </section>

      <ToastContainer />
    </main>
  );
}