import React from "react";
import Training from '../assets/training.jpeg';
import "./About.css"; // We'll provide CSS after the component

function About() {
  return (
    <section className="about-page max-w-5xl mx-auto p-6 md:p-12 font-sans text-gray-800">
      {/* Brand Story */}
      <header className="brand-story mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
          Our Wig & Braid Journey
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          What started as a passion for beauty and creativity has blossomed into a thriving community dedicated to empowering women through expert wig making and braiding. Our founder’s journey began with a simple desire to help others feel confident and beautiful every day.
        </p>
      </header>

      {/* Mission & Vision */}
      <section className="mission-vision mb-12 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-pink-600 mb-6">Our Mission & Vision</h2>
        <p className="text-gray-700 text-lg mb-4">
          <strong>Mission:</strong> To empower women with beauty and confidence by providing top-quality wig and braid training, products, and services.
        </p>
        <p className="text-gray-700 text-lg">
          <strong>Vision:</strong> To be the leading brand that inspires creativity, authenticity, and excellence in the wig and braid industry worldwide.
        </p>
      </section>

      {/* Meet the Founder / Team */}
      <section className="team mb-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">Meet the Founder & Team</h2>
        <div className="team-members grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Founder */}
          <article className="team-member text-center p-4 bg-white rounded-lg shadow-md">
            <img
              src= {Training}
              alt="Founder - Balogun Opeyemi"
              className="mx-auto rounded-full w-40 h-40 object-cover mb-4"
            />
            <div>
              <h3 className="about-text">Balogun Opeyemi</h3>
            <p className=" about-title ">Founder & Lead Stylist</p>
            <p className="about-subtitle ">
               Opeyemi’s passion for hair artistry and empowering women led her to create this brand. With over 10 years of experience, she is dedicated to sharing her expertise.
            </p>
            </div>
          </article>

          {/* Team Member 1
          <article className="team-member text-center p-4 bg-white rounded-lg shadow-md">
            <img
              src="/images/team1.jpg"
              alt="Team Member - Sarah Lee"
              className="mx-auto rounded-full w-40 h-40 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">Sarah Lee</h3>
            <p className="text-pink-600 font-medium mb-2">Senior Trainer</p>
            <p className="text-gray-600 text-sm">
              Sarah specializes in advanced braiding techniques and personalized coaching to help students excel.
            </p>
          </article> */}

          {/* Team Member 2 */}
          {/* <article className="team-member text-center p-4 bg-white rounded-lg shadow-md">
            <img
              src="/images/team2.jpg"
              alt="Team Member - Michael Smith"
              className="mx-auto rounded-full w-40 h-40 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">Michael Smith</h3>
            <p className="text-pink-600 font-medium mb-2">Product Specialist</p>
            <p className="text-gray-600 text-sm">
              Michael ensures our products meet the highest standards of quality and authenticity.
            </p>
          </article> */}
        </div>
      </section>

      {/* Values */}
      <section className="values mb-12 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-pink-600 mb-6">Our Core Values</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-3 max-w-md mx-auto">
          <li><strong>Quality:</strong> We deliver only the best products and training.</li>
          <li><strong>Authenticity:</strong> Genuine care and transparency in everything we do.</li>
          <li><strong>Customer Focus:</strong> Your satisfaction and success are our top priorities.</li>
        </ul>
      </section>

      {/* Achievements */}
      <section className="achievements mb-12 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-pink-600 mb-6">Our Achievements</h2>
        <ul className="text-gray-700 text-lg space-y-3 max-w-md mx-auto">
          <li>🏆 Featured in <em>Beauty Today Magazine</em> (2023)</li>
          <li>🎖️ Winner of the Best Wig Training Program Award (2022)</li>
          <li>📈 Over 1,000 successful students trained worldwide</li>
          <li>🌟 Recognized for excellence in customer service</li>
        </ul>
      </section>
    </section>
  );
}

export default About;