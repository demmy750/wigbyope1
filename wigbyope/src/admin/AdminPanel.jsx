import React, { useState, useEffect } from "react";
import fetchWithAuth from "../Components/AuthModal"; // adjust import path

export default function ProductsTab({ activeTab }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products
  useEffect(() => {
    if (activeTab !== "products") return;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchWithAuth("/api/products");
        setProducts(data);
      } catch (err) {
        setProductsError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  // ---------------------------
  // Add product
  // ---------------------------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // 1. Upload image
    let imageUrl = "";
    if (formData.get("image") && formData.get("image").size > 0) {
      const imgData = new FormData();
      imgData.append("image", formData.get("image"));

      const uploadRes = await fetch("/api/upload/product", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: imgData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message);
      imageUrl = uploadData.url;
    }

    // 2. Create product
    const productData = {
      name: formData.get("name"),
      price: formData.get("price"),
      category: formData.get("category"),
      color: formData.get("color"),
      length: formData.get("length"),
      stock: formData.get("stock"),
      description: formData.get("description"),
      images: imageUrl ? [imageUrl] : [],
    };

    try {
      const newProduct = await fetchWithAuth("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      setProducts([newProduct, ...products]);
      e.target.reset();
    } catch (err) {
      alert("Error adding product: " + err.message);
    }
  };

  // ---------------------------
  // Delete product
  // ---------------------------
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetchWithAuth(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  // ---------------------------
  // Update product
  // ---------------------------
  const handleUpdateProduct = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // 1. Upload new image (optional)
    let imageUrl = "";
    if (formData.get("image") && formData.get("image").size > 0) {
      const imgData = new FormData();
      imgData.append("image", formData.get("image"));

      const uploadRes = await fetch("/api/upload/product", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: imgData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message);
      imageUrl = uploadData.url;
    }

    // 2. Update product
    const productData = {
      name: formData.get("name"),
      price: formData.get("price"),
      category: formData.get("category"),
      color: formData.get("color"),
      length: formData.get("length"),
      stock: formData.get("stock"),
      description: formData.get("description"),
      ...(imageUrl && { images: [imageUrl] }),
    };

    try {
      const updated = await fetchWithAuth(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      setProducts(products.map((p) => (p._id === id ? updated : p)));
      setEditingProduct(null);
    } catch (err) {
      alert("Error updating product: " + err.message);
    }
  };

  // ✅ Render
  if (activeTab !== "products") return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Manage Products</h3>

      {/* Add product form */}
      <form className="grid gap-4 mb-6" onSubmit={handleAddProduct}>
        <input name="name" placeholder="Product Name" className="border p-2 rounded" required />
        <input name="price" type="number" step="0.01" placeholder="Price" className="border p-2 rounded" required />
        <input name="category" placeholder="Category" className="border p-2 rounded" />
        <input name="color" placeholder="Color" className="border p-2 rounded" />
        <input name="length" type="number" placeholder="Length" className="border p-2 rounded" />
        <input name="stock" type="number" placeholder="Stock" className="border p-2 rounded" />
        <textarea name="description" placeholder="Description" className="border p-2 rounded" />
        <input type="file" name="image" accept="image/*" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
      </form>

      {/* Products list */}
      {loadingProducts && <p>Loading products...</p>}
      {productsError && <p className="text-red-600">{productsError}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">${p.price.toFixed(2)}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.category || "-"}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => setEditingProduct(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteProduct(p._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit product modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <form onSubmit={(e) => handleUpdateProduct(e, editingProduct._id)} className="grid gap-3">
              <input name="name" defaultValue={editingProduct.name} placeholder="Product Name" className="border p-2 rounded" required />
              <input name="price" defaultValue={editingProduct.price} type="number" step="0.01" placeholder="Price" className="border p-2 rounded" required />
              <input name="category" defaultValue={editingProduct.category} placeholder="Category" className="border p-2 rounded" />
              <input name="color" defaultValue={editingProduct.color} placeholder="Color" className="border p-2 rounded" />
              <input name="length" defaultValue={editingProduct.length} type="number" placeholder="Length" className="border p-2 rounded" />
              <input name="stock" defaultValue={editingProduct.stock} type="number" placeholder="Stock" className="border p-2 rounded" />
              <textarea name="description" defaultValue={editingProduct.description} placeholder="Description" className="border p-2 rounded" />
              <input type="file" name="image" accept="image/*" className="border p-2 rounded" />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
