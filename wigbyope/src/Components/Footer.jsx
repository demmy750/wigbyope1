import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer" role="contentinfo">
    <div className="container footer-container">
      <div className="footer-logo" aria-label="Company Logo">WIGBYOPE</div>
      <nav className="footer-nav" aria-label="Footer Navigation">
        <a href="/" className="footer-link">Home</a>
        <a href="/services" className="footer-link">Services</a>
        <a href="/shop" className="footer-link">Shop</a>
        <a href="/training" className="footer-link">Training</a>
        <a href="/about" className="footer-link">About</a>
        <a href="/blog" className="footer-link">Blog</a>
        <a href="/contact" className="footer-link">Contact</a>
      </nav>
      <p className="footer-copy">© 2024 Wigbyope. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;