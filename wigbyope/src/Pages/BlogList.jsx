// src/components/Blog/BlogList.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { blogs } from "./blogData";

const categories = ["All", "Wig Care", "Styling Tips", "Hair Trends"];

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.categories.includes(selectedCategory));

  return (
    <div className="blog-list-container" style={{ padding: "2rem" }}>
      <h1>Our Blog</h1>

      <div className="categories" style={{ marginBottom: "1rem" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: selectedCategory === cat ? "#333" : "#eee",
              color: selectedCategory === cat ? "#fff" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div
        className="blog-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredBlogs.map(({ id, title, snippet, image }) => (
          <Link
            to={`/blog/${id}`}
            key={id}
            className="blog-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={image}
              alt={title}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <div style={{ padding: "1rem" }}>
              <h3>{title}</h3>
              <p>{snippet}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}