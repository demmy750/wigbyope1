import React, { useState } from "react";
import EnrollModal from "./EnrollModal"; // Adjust path if needed
import './Training.css';

function Training() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  const openEnrollModal = () => setIsEnrollOpen(true);
  const closeEnrollModal = () => setIsEnrollOpen(false);

  return (
    <section className="training-page max-w-5xl mx-auto p-6 md:p-12 font-sans text-gray-800">
      {/* Hero Banner */}
      <header className="hero-banner text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
          Learn Expert Wig Making, Styling & Braiding Techniques
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Unlock your creativity and elevate your skills with our comprehensive training programs designed for all levels.
        </p>
        <button
          className="enroll-btn"
          onClick={openEnrollModal}
          aria-label="Enroll Now"
        >
          Enroll Now
        </button>
      </header>

      {/* Training Packages */}
      <section className="training-packages mb-12">
        <h2 className="text-3xl font-semibold text-pink-600 mb-6">Our Training Packages</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <article className="package bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Online Classes</h3>
            <p className="text-gray-600 mb-4">
              Interactive live sessions via Zoom and on-demand recorded videos. Learn at your own pace from anywhere.
            </p>
          </article>
          <article className="package bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">In-Person Classes</h3>
            <p className="text-gray-600 mb-4">
              Hands-on training at our studio with expert instructors. Upcoming sessions: <strong>[Location]</strong> | <strong>[Date]</strong>
            </p>
          </article>
          <article className="package bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">One-on-One Coaching</h3>
            <p className="text-gray-600 mb-4">
              Personalized coaching tailored to your goals and schedule. Get direct mentorship from industry professionals.
            </p>
          </article>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="curriculum-preview mb-12">
        <h2 className="text-3xl font-semibold text-pink-600 mb-6">Curriculum Preview</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 max-w-3xl mx-auto">
          <li>Lace Wig Installation & Customization</li>
          <li>Hair Coloring & Highlighting</li>
          <li>Ventilation & Hair Knotting</li>
          <li>Braiding Styles & Techniques (Box Braids, Cornrows, Twists, etc.)</li>
          <li>Styling & Maintenance Best Practices</li>
          <li>Business & Client Management Tips for Wig & Braid Professionals</li>
        </ul>
      </section>

      {/* Testimonials */}
      <section className="testimonials mb-12 bg-pink-50 rounded-lg p-8 max-w-4xl mx-auto shadow-inner">
        <h2 className="text-3xl font-semibold text-pink-600 mb-6 text-center">Success Stories</h2>
        <blockquote className="mb-6 italic text-gray-800">
          “The training gave me the confidence and skills to start my own wig and braid business!” – <strong>Jessica M.</strong>
        </blockquote>
        <blockquote className="mb-6 italic text-gray-800">
          “One-on-one coaching helped me master complex braiding techniques and lace installation.” – <strong>Tina R.</strong>
        </blockquote>
        <p className="text-center text-pink-600 font-semibold cursor-pointer hover:underline" onClick={() => window.location.href = "/testimonials"}>
          Read more testimonials from our successful students.
        </p>
      </section>

      {/* Pricing & Payment Plans */}
      <section className="pricing mb-12 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-pink-600 mb-6 text-center">Pricing & Payment Plans</h2>
        <ul className="space-y-4 text-gray-700 text-center">
          <li><strong>Online Classes:</strong> Starting at $199</li>
          <li><strong>In-Person Classes:</strong> Starting at $499</li>
          <li><strong>One-on-One Coaching:</strong> Custom pricing available</li>
        </ul>
        <p className="mt-4 text-center text-gray-600">
          Ask about installment plans and group discounts.
        </p>
      </section>

      {/* Call to Action */}
      <section className="call-to-action text-center mb-12">
        <h2 className="text-3xl font-semibold text-pink-600 mb-4">Ready to Elevate Your Wig & Braid Skills?</h2>
        <button
          className="enroll-btn"
          onClick={openEnrollModal}
          aria-label="Enroll Now"
        >
          Enroll Now
        </button>
      </section>

      {/* Contact Info */}
      <footer className="contact-info text-center text-gray-600">
        <p>Have questions? <a href="/contact" className="text-pink-600 hover:underline">Contact Us</a> for personalized guidance.</p>
      </footer>

      {/* Enrollment Modal */}
      <EnrollModal isOpen={isEnrollOpen} onClose={closeEnrollModal} />
    </section>
  );
}

export default Training;