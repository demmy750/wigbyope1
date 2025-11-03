// BlogListing.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Ultimate Wig Care Guide",
    snippet: "Learn how to keep your wig looking fresh and natural...",
    image: "/images/blog/wig-care.jpg",
    categories: ["Wig Care"],
    slug: "ultimate-wig-care-guide",
  },
  {
    id: 2,
    title: "Top Styling Tips for Lace Wigs",
    snippet: "Master styling your lace wig with these expert tips...",
    image: "/images/blog/styling-tips.jpg",
    categories: ["Styling Tips"],
    slug: "top-styling-tips-lace-wigs",
  },
  {
    id: 3,
    title: "2024 Hair Trends You’ll Love",
    snippet: "Stay ahead with the hottest hair trends this year...",
    image: "/images/blog/hair-trends.jpg",
    categories: ["Hair Trends"],
    slug: "2024-hair-trends",
  },
];

const allCategories = ["All", "Wig Care", "Styling Tips", "Hair Trends"];

export default function BlogListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.categories.includes(selectedCategory));

  return (
    <section className="blog-listing" aria-label="Blog listing">
      <h1>Our Blog</h1>

      <nav aria-label="Blog categories" className="blog-categories">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cat === selectedCategory ? "active" : ""}
            aria-pressed={cat === selectedCategory}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className="blog-cards">
        {filteredPosts.map(({ id, title, snippet, image, slug }) => (
          <article key={id} className="blog-card">
            <Link to={`/blog/${slug}`} aria-label={`Read more about ${title}`}>
              <img src={image} alt={title} loading="lazy" />
              <h2>{title}</h2>
              <p>{snippet}</p>
              <span className="read-more">Read More →</span>
            </Link>
          </article>
        ))}
        {filteredPosts.length === 0 && <p>No posts found in this category.</p>}
      </div>
    </section>
  );
}