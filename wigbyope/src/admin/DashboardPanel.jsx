import React, { useState, useEffect } from "react";
// import fetchWithAuth from "../Components/AuthModal";
import { fetchWithAuth } from "../api";

export default function ProductsTab({ activeTab }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addImagePreviews, setAddImagePreviews] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);

  useEffect(() => {
    if (activeTab !== "products") return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchWithAuth("/api/products");
        setProducts(data);
      } catch (err) {
        setProductsError(err.message || "Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  const handleAddImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
      const previews = files.map((file) => URL.createObjectURL(file));
      setAddImagePreviews(previews);
    } else {
      setAddImagePreviews([]);
    }
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map((file) => URL.createObjectURL(file));
      setEditImagePreviews(previews);
    } else {
      setEditImagePreviews([]);
    }
  };

  const uploadImages = async (files) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const imgData = new FormData();
      imgData.append("image", files[i]);

      const uploadRes = await fetch("/api/upload/product", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: imgData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Image upload failed");
      }
      urls.push(uploadData.url);
    }
    return urls;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      let imageUrls = [];
      const files = e.target.image.files;
      if (files.length > 0) {
        imageUrls = await uploadImages(files);
      }

      const productData = {
        name: formData.get("name"),
        price: parseFloat(formData.get("price")),
        description: formData.get("description"),
        category: formData.get("category"),
        color: formData.get("color"),
        length: formData.get("length"),
        stock: parseInt(formData.get("stock")),
        // wigType: formData.get("wigType"),
        // hairTexture: formData.get("hairTexture"),
        // capSize: formData.get("capSize"),
        images: imageUrls,
      };

      const newProduct = await fetchWithAuth("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      setProducts([newProduct, ...products]);
      e.target.reset();
      setAddImagePreviews([]);
      alert("Product added successfully!");
    } catch (err) {
      alert("Error adding product: " + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetchWithAuth(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted.");
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  const handleUpdateProduct = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      let imageUrls = [];
      const files = e.target.image.files;
      if (files.length > 0) {
        imageUrls = await uploadImages(files);
      }

      const productData = {
        name: formData.get("name"),
        price: parseFloat(formData.get("price")),
        description: formData.get("description"),
        category: formData.get("category"),
        color: formData.get("color"),
        length: formData.get("length"),
        stock: parseInt(formData.get("stock")),
        // wigType: formData.get("wigType"),
        // hairTexture: formData.get("hairTexture"),
        // capSize: formData.get("capSize"),
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const updated = await fetchWithAuth(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      setProducts(products.map((p) => (p._id === id ? updated : p)));
      setEditingProduct(null);
      setEditImagePreviews([]);
      alert("Product updated successfully!");
    } catch (err) {
      alert("Error updating product: " + err.message);
    }
  };

  if (activeTab !== "products") return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Manage Products</h3>

      {/* Add product form */}
      <form className="grid gap-4 mb-6" onSubmit={handleAddProduct}>
        <input name="name" placeholder="Product Name" className="border p-2 rounded" required />
        <input name="price" type="number" step="0.01" placeholder="Price" className="border p-2 rounded" required />
        <textarea name="description" placeholder="Description" className="border p-2 rounded" />
        <input name="category" placeholder="Category" className="border p-2 rounded" />
        <input name="color" placeholder="Color" className="border p-2 rounded" />
        <input name="length" placeholder="Length" className="border p-2 rounded" />
        <input name="stock" type="number" placeholder="Stock" className="border p-2 rounded" />
        {/* <input name="wigType" placeholder="Wig Type" className="border p-2 rounded" />
        <input name="hairTexture" placeholder="Hair Texture" className="border p-2 rounded" />
        <input name="capSize" placeholder="Cap Size" className="border p-2 rounded" /> */}
        <input type="file" name="image" accept="image/*" multiple className="border p-2 rounded" onChange={handleAddImageChange} />
        {addImagePreviews.length > 0 && (
          <div className="flex gap-2 mt-2">
            {addImagePreviews.map((src, i) => (
              <img key={i} src={src} alt={`Preview ${i}`} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
      </form>

      {/* Products list */}
      {loadingProducts && <p>Loading products...</p>}
      {productsError && <p className="text-red-600">{productsError}</p>}

      {products.length === 0 && !loadingProducts && (
        <p className="text-gray-600">No products found. Please add your first product above.</p>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Wig Type</th>
              <th className="p-2 text-left">Hair Texture</th>
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
                <td className="p-2">{p.wigType || "-"}</td>
                <td className="p-2">{p.hairTexture || "-"}</td>
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <form onSubmit={(e) => handleUpdateProduct(e, editingProduct._id)} className="grid gap-3">
              <input name="name" defaultValue={editingProduct.name} placeholder="Product Name" className="border p-2 rounded" required />
              <input name="price" defaultValue={editingProduct.price} type="number" step="0.01" placeholder="Price" className="border p-2 rounded" required />
              <textarea name="description" defaultValue={editingProduct.description} placeholder="Description" className="border p-2 rounded" />
              <input name="category" defaultValue={editingProduct.category} placeholder="Category" className="border p-2 rounded" />
              <input name="color" defaultValue={editingProduct.color} placeholder="Color" className="border p-2 rounded" />
              <input name="length" defaultValue={editingProduct.length} placeholder="Length" className="border p-2 rounded" />
              <input name="stock" defaultValue={editingProduct.stock} type="number" placeholder="Stock" className="border p-2 rounded" />
              <input name="wigType" defaultValue={editingProduct.wigType} placeholder="Wig Type" className="border p-2 rounded" />
              <input name="hairTexture" defaultValue={editingProduct.hairTexture} placeholder="Hair Texture" className="border p-2 rounded" />
              <input name="capSize" defaultValue={editingProduct.capSize} placeholder="Cap Size" className="border p-2 rounded" />
              <input type="file" name="image" accept="image/*" multiple className="border p-2 rounded" onChange={handleEditImageChange} />
              {(editImagePreviews.length > 0 || (editingProduct.images && editingProduct.images.length > 0)) && (
                <div className="flex gap-2 mt-2">
                  {editImagePreviews.length > 0
                    ? editImagePreviews.map((src, i) => (
                        <img key={i} src={src} alt={`Preview ${i}`} className="w-20 h-20 object-cover rounded" />
                      ))
                    : editingProduct.images.map((url, i) => (
                        <img key={i} src={url} alt={`Current ${i}`} className="w-20 h-20 object-cover rounded" />
                      ))}
                </div>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => { setEditingProduct(null); setEditImagePreviews([]); }} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}