// src/components/Blog/BlogSingle.js
import React from "react";
import { useParams, Link } from "react-router-dom";
import { blogs } from "./blogData";

export default function BlogSingle() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog)
    return (
      <div style={{ padding: "2rem" }}>
        <p>Blog post not found.</p>
        <Link to="/blog">Back to Blog</Link>
      </div>
    );

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    instagram: `https://www.instagram.com/`, // Instagram no direct share
    pinterest: `https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${blog.image}&description=${blog.title}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      blog.title + " " + window.location.href
    )}`,
  };

  return (
    <article style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <Link to="/blog" style={{ marginBottom: "1rem", display: "inline-block" }}>
        ← Back to Blog
      </Link>

      <img
        src={blog.image}
        alt={blog.title}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
      />

      <h1>{blog.title}</h1>

      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        style={{ marginBottom: "2rem" }}
      />

      <section
        style={{
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #ddd",
          paddingTop: "1rem",
          marginBottom: "2rem",
        }}
      >
        <img
          src={blog.author.avatar}
          alt={blog.author.name}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            marginRight: "1rem",
          }}
        />
        <div>
          <h4>{blog.author.name}</h4>
          <p>{blog.author.bio}</p>
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Share this post:</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/24/733/733547.png"
              alt="Facebook"
            />
          </a>
          <a
            href={shareUrls.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Instagram"
            title="Instagram does not support direct sharing"
            onClick={(e) => e.preventDefault()}
            style={{ opacity: 0.5, cursor: "not-allowed" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/24/733/733558.png"
              alt="Instagram"
            />
          </a>
          <a
            href={shareUrls.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Pinterest"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/24/733/733558.png"
              alt="Pinterest"
            />
          </a>
          <a
            href={shareUrls.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/24/733/733585.png"
              alt="WhatsApp"
            />
          </a>
        </div>
      </section>

      <section>
        <h3>Comments</h3>
        <CommentSection />
      </section>
    </article>
  );
}

function CommentSection() {
  const [comments, setComments] = React.useState([]);
  const [input, setInput] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setComments([...comments, input.trim()]);
    setInput("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Write a comment..."
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ marginTop: "0.5rem" }}>
          Post Comment
        </button>
      </form>
      <div>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c, i) => (
          <p key={i} style={{ borderBottom: "1px solid #eee", padding: "0.5rem 0" }}>
            {c}
          </p>
        ))}
      </div>
    </div>
  );
}