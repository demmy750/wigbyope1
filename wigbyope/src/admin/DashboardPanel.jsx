import React, { useState, useEffect, useRef } from "react";
import { fetchWithAuth } from "../api";
import './DashboardPanel.css'; // Import your custom CSS

export default function ProductsTab({ activeTab }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addImagePreviews, setAddImagePreviews] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [addSelectedFiles, setAddSelectedFiles] = useState([]); // Track accumulated files for add
  const [editSelectedFiles, setEditSelectedFiles] = useState([]); // Track accumulated files for edit
  // const [removingImages, setRemovingImages] = useState([]); // Track which existing images to remove in edit (array of indices)

  // Refs for file inputs to trigger "Add More"
  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    if (activeTab !== "products") return;
    setProductsError(null);  // Reset error
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchWithAuth("/api/products");
        console.log('Fetched products from admin:', data);  // DEBUG: Verify _id and images are unique
        setProducts(data || []);  // Ensure it's always an array
        
      } catch (err) {
        // setProductsError(err.message || "Failed to load products");
        console.error('Admin fetch error:', err);  // DEBUG
        setProductsError(err.message || "Failed to load products");
        setProducts([]);  // Fallback to empty array to avoid undefined
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  // Cleanup object URLs on unmount or reset to prevent memory leaks
  useEffect(() => {
    return () => {
      addImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      editImagePreviews.forEach((url) => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url); // Only revoke blob URLs, not server URLs
      });
    };
  }, [addImagePreviews, editImagePreviews]);

  const handleAddImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    // Append new files to existing
    const updatedFiles = [...addSelectedFiles, ...newFiles];
    if (updatedFiles.length > 10) {
      alert("Maximum 10 images allowed!");
      e.target.value = ''; // Clear input
      return;
    }
    setAddSelectedFiles(updatedFiles);

    // Create previews for new files only and append
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setAddImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = ''; // Clear input for next selection
  };

  const handleEditImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    // Check total (existing + new)
    const totalImages = (editingProduct?.images?.length || 0) + editSelectedFiles.length + newFiles.length;
    if (totalImages > 10) {
      alert("Maximum 10 images total allowed!");
      e.target.value = '';
      return;
    }

    // Append new files to existing new files
    const updatedFiles = [...editSelectedFiles, ...newFiles];
    setEditSelectedFiles(updatedFiles);

    // Create previews for new files only and append to new previews (existing are server URLs)
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    // Filter to keep only existing + new blob previews
    setEditImagePreviews((prev) => {
      const existing = editingProduct?.images || [];
      const currentNew = prev.filter(url => url.startsWith('blob:'));
      return [...existing, ...currentNew, ...newPreviews];
    });
    e.target.value = ''; // Clear input
  };

  // Trigger file input click for "Add More"
  const triggerAddMoreImages = (isEdit = false) => {
    if (isEdit) {
      editFileInputRef.current?.click();
    } else {
      addFileInputRef.current?.click();
    }
  };

  // Remove a specific new preview/file (only for new ones; index based on new previews array)
  const removeNewPreview = (indexToRemove, isEdit = false) => {
    if (isEdit) {
      // Remove from new files and new previews only (existing stay)
      setEditSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
      setEditImagePreviews((prev) => {
        const existing = editingProduct?.images || [];
        const newPreviews = prev.filter(url => url.startsWith('blob:')).filter((_, i) => i !== indexToRemove);
        return [...existing, ...newPreviews];
      });
    } else {
      setAddSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
      setAddImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    }
  };

  const uploadImages = async (files) => {
    if (files.length === 0) return [];

    const formData = new FormData();
    // Append all files (Multer will collect as req.files)
    Array.from(files).forEach((file) => {
      formData.append('image', file);
    });

    try {
      const uploadRes = await fetch("/api/upload/product", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Image upload failed");
      }
      return uploadData.urls || [];
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      let imageUrls = [];
      if (addSelectedFiles.length > 0) {
        imageUrls = await uploadImages(addSelectedFiles);
      }

      const productData = {
        name: formData.get("name"),
        price: parseFloat(formData.get("price")),
        description: formData.get("description"),
        category: formData.get("category"),
        color: formData.get("color"),
        length: formData.get("length"),
        stock: parseInt(formData.get("stock")),
        wigType: formData.get("wigType"),
        hairTexture: formData.get("hairTexture"),
        capSize: formData.get("capSize"),
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
      setAddSelectedFiles([]);
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
      let finalImages = editingProduct.images || []; // Preserve existing
      if (editSelectedFiles.length > 0) {
        imageUrls = await uploadImages(editSelectedFiles);
        finalImages = [...finalImages, ...imageUrls]; // Append new to existing
      }

      const productData = {
        name: formData.get("name"),
        price: parseFloat(formData.get("price")),
        description: formData.get("description"),
        category: formData.get("category"),
        color: formData.get("color"),
        length: formData.get("length"),
        stock: parseInt(formData.get("stock")),
        wigType: formData.get("wigType"),
        hairTexture: formData.get("hairTexture"),
        capSize: formData.get("capSize"),
        images: finalImages,
      };

      const updated = await fetchWithAuth(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      setProducts(products.map((p) => (p._id === id ? updated : p)));
      setEditingProduct(null);
      setEditImagePreviews([]);
      setEditSelectedFiles([]);
      alert("Product updated successfully!");
    } catch (err) {
      alert("Error updating product: " + err.message);
    }
  };

  // Reset edit previews to show existing images when opening modal
  useEffect(() => {
    if (editingProduct) {
      // Existing images are server URLs, new previews are blob URLs
      setEditImagePreviews(editingProduct.images || []);
      setEditSelectedFiles([]);
    }
  }, [editingProduct]);

  if (activeTab !== "products") return null;

  return (
    <div className="products-tab">
      <h3 className="tab-title">Manage Products</h3>

      {/* Add product form */}
      <form className="add-product-form" onSubmit={handleAddProduct}>
        <input name="name" placeholder="Product Name" className="form-input" required />
        <input name="price" type="number" step="0.01" placeholder="Price" className="form-input" required />
        <textarea name="description" placeholder="Description" className="form-input" />
        <input name="category" placeholder="Category" className="form-input" />
        <input name="color" placeholder="Color" className="form-input" />
        <input name="length" placeholder="Length" className="form-input" />
        <input name="stock" type="number" placeholder="Stock" className="form-input" />
        <input name="wigType" placeholder="Wig Type" className="form-input" />
        <input name="hairTexture" placeholder="Hair Texture" className="form-input" />
        <input name="capSize" placeholder="Cap Size" className="form-input" />
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          multiple 
          ref={addFileInputRef}
          className="file-input" 
          onChange={handleAddImageChange}
          style={{ display: 'none' }} // Hidden, triggered by button
        />
        <div className="image-section">
          <div className="image-previews">
            {addImagePreviews.map((src, i) => (
              <div key={i} className="preview-wrapper">
                <img src={src} alt={`Preview ${i}`} className="preview-image" />
                <button 
                  type="button" 
                  className="remove-preview" 
                  onClick={() => removeNewPreview(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {addSelectedFiles.length > 0 && (
            <p className="image-counter">{addSelectedFiles.length} image(s) selected</p>
          )}
          <button 
            type="button" 
            className="add-more-btn" 
            onClick={() => triggerAddMoreImages()}
          >
            + Add More Images
          </button>
        </div>
        <button type="submit" className="submit-btn">Add Product</button>
      </form>

      {/* Products list */}
      {loadingProducts && <p className="loading-msg">Loading products...</p>}
      {productsError && <p className="error-msg">{productsError}</p>}

      {products.length === 0 && !loadingProducts && (
        <p className="no-products-msg">No products found. Please add your first product above.</p>
      )}

      <div className="table-wrapper">
        <table className="products-table">
          <thead className="table-header">
            <tr className="header-row">
              <th className="header-cell">Name</th>
              <th className="header-cell">Price</th>
              <th className="header-cell">Stock</th>
              <th className="header-cell">Category</th>
              <th className="header-cell">Color</th>
              <th className="header-cell">Length</th>
              <th className="header-cell">Wig Type</th>
              <th className="header-cell">Hair Texture</th>
              <th className="header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {products.map((p) => (
              <tr key={p._id} className="data-row">
                <td className="data-cell">{p.name}</td>
                <td className="data-cell">${p.price ? p.price.toFixed(2) : '0.00'}</td>
                <td className="data-cell">{p.stock || 0}</td>
                <td className="data-cell">{p.category || "-"}</td>
                <td className="data-cell">{p.color || "-"}</td>
                <td className="data-cell">{p.length || "-"}</td>
                <td className="data-cell">{p.wigType || "-"}</td>
                <td className="data-cell">{p.hairTexture || "-"}</td>
                <td className="data-cell action-cell">
                  <button onClick={() => setEditingProduct(p)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteProduct(p._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit product modal */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="edit-title">Edit Product</h3>
            <form onSubmit={(e) => handleUpdateProduct(e, editingProduct._id)} className="edit-product-form">
              <input name="name" defaultValue={editingProduct.name} placeholder="Product Name" className="form-input" required />
              <input name="price" defaultValue={editingProduct.price} type="number" step="0.01" placeholder="Price" className="form-input" required />
              <textarea name="description" defaultValue={editingProduct.description} placeholder="Description" className="form-input" />
              <input name="category" defaultValue={editingProduct.category} placeholder="Category" className="form-input" />
              <input name="color" defaultValue={editingProduct.color} placeholder="Color" className="form-input" />
              <input name="length" defaultValue={editingProduct.length} placeholder="Length" className="form-input" />
              <input name="stock" defaultValue={editingProduct.stock} type="number" placeholder="Stock" className="form-input" />
              <input name="wigType" defaultValue={editingProduct.wigType} placeholder="Wig Type" className="form-input" />
              <input name="hairTexture" defaultValue={editingProduct.hairTexture} placeholder="Hair Texture" className="form-input" />
              <input name="capSize" defaultValue={editingProduct.capSize} placeholder="Cap Size" className="form-input" />
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                multiple 
                ref={editFileInputRef}
                className="file-input" 
                onChange={handleEditImageChange}
                style={{ display: 'none' }} // Hidden, triggered by button
              />
              <div className="image-section">
                <div className="image-previews">
                  {/* Existing images (non-removable) */}
                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <>
                      <p className="existing-images-label">Existing Images:</p>
                      {editingProduct.images.map((url, i) => (
                        <div key={`existing-${i}`} className="preview-wrapper existing-preview">
                          <img src={url} alt={`Existing ${i}`} className="preview-image" />
                          {/* No remove button for existing */}
                        </div>
                      ))}
                    </>
                  )}
                  {/* New previews (removable) */}
                  {editImagePreviews.filter(url => url.startsWith('blob:')).map((src, i) => (
                    <div key={`new-${i}`} className="preview-wrapper">
                      <img src={src} alt={`New Preview ${i}`} className="preview-image" />
                      <button 
                        type="button" 
                        className="remove-preview" 
                        onClick={() => removeNewPreview(i, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {editSelectedFiles.length > 0 && (
                  <p className="image-counter">{editSelectedFiles.length} new image(s) selected</p>
                )}
                <button 
                  type="button" 
                  className="add-more-btn" 
                  onClick={() => triggerAddMoreImages(true)}
                >
                  + Add More Images
                </button>
              </div>
              <div className="modal-buttons">
                <button 
                  type="button" 
                  onClick={() => { 
                    setEditingProduct(null); 
                    setEditImagePreviews([]); 
                    setEditSelectedFiles([]); 
                  }} 
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="update-btn">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}