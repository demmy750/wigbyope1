import React from 'react';
import { Scissors, GraduationCap, Sparkles } from 'lucide-react';
import './HomeService.css';

const services = [
  {
    title: 'Custom Wig Design',
    description:
      'Expertly crafted wigs tailored to your unique style, face shape, and preferences for a flawless, natural look.',
    icon: <Scissors size={48} color="#9c27b0" aria-hidden="true" />,
  },
  {
    title: 'Styling Training',
    description:
      'Professional, hands-on guidance to master wig styling techniques and boost your confidence every day.',
    icon: <GraduationCap size={48} color="#9c27b0" aria-hidden="true" />,
  },
  {
    title: 'Maintenance Service',
    description:
      'Comprehensive care and upkeep to keep your wig looking fresh, vibrant, and long-lasting.',
    icon: <Sparkles size={48} color="#9c27b0" aria-hidden="true" />,
  },
];

const HomeService = () => (
  <main className="container" aria-labelledby="services-heading">
    <section className="services-intro">
      <h2 id="services-heading">Our Premium Wig Services</h2>
      <p>
        Discover our curated range of expert services designed to elevate your wig experience with style, comfort, and confidence.
      </p>
    </section>

    <section className="services-list" aria-label="List of wig services">
      {services.map(({ title, description, icon }) => (
        <article key={title} className="service-card" tabIndex="0" aria-describedby={`${title.replace(/\s+/g, '-').toLowerCase()}-desc`}>
          <div className="icon">{icon}</div>
          <h3>{title}</h3>
          <p id={`${title.replace(/\s+/g, '-').toLowerCase()}-desc`}>{description}</p>
        </article>
      ))}
    </section>
  </main>
);

export default HomeService;