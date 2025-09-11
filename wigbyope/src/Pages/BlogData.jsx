// src/components/Blog/blogData.js
export const blogs = [
  {
    id: 1,
    title: "Wig Care: How to Keep Your Wig Fresh",
    snippet: "Learn the best tips to maintain your wig's quality and longevity.",
    content: `
      <h2>Introduction</h2>
      <p>Taking care of your wig is essential to keep it looking natural and fresh.</p>
      <img src="https://example.com/wig-care.jpg" alt="Wig Care" />
      <h3>Washing Tips</h3>
      <p>Use sulfate-free shampoos and cold water.</p>
    `,
    image: "https://example.com/wig-care-hero.jpg",
    author: {
      name: "Jane Doe",
      bio: "Hair stylist and wig expert with 10 years of experience.",
      avatar: "https://example.com/jane-avatar.jpg",
    },
    categories: ["Wig Care"],
  },
  {
    id: 2,
    title: "Styling Tips for Your New Wig",
    snippet: "Discover how to style your wig for any occasion.",
    content: `
      <h2>Styling Basics</h2>
      <p>Use heat protectants and avoid excessive heat.</p>
      <img src="https://example.com/styling-tips.jpg" alt="Styling Tips" />
    `,
    image: "https://example.com/styling-hero.jpg",
    author: {
      name: "John Smith",
      bio: "Professional stylist specializing in wigs and extensions.",
      avatar: "https://example.com/john-avatar.jpg",
    },
    categories: ["Styling Tips"],
  },
  // Add more blog posts here
];