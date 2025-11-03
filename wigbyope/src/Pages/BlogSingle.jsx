import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchWithAuth } from "../../api";

export default function BlogSingle() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBlog() {
      try {
        const data = await fetchWithAuth(`/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [id]);

  if (loading) return <p>Loading blog post...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!blog) return <p>Blog post not found.</p>;

  // ...rest of your BlogSingle JSX (same as before)
}