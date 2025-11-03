import React, { useState, useEffect } from "react";
import "./HeroBanner.css";


const slides = [
  {
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    title: "Be Bold. Be Confident.",
    subtitle: "Express yourself with styles that match your vibe.",
  },
  {
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    title: "Redefine Your Beauty with WIGBYOPE",
    subtitle: "Luxury, Confidence, and Elegance — One Wig at a Time.",
  },
  {
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    title: "Luxury Wigs for Every Occasion",
    subtitle: "From casual to glam — find the perfect look.",
  },
  
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              {slide.title.split("WIGBYOPE")[0]}
              <span>WIGBYOPE</span>
            </h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <div className="hero-buttons">
              <a href="/shop" className="btn-gradient">Shop Now</a>
              <a href="/about" className="btn-outline">Learn More</a>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Navigation */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}
