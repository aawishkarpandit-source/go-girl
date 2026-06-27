import { useEffect, useState, useRef } from "react";
import { dbGetProducts, dbCreateProduct, dbUpdateProduct, dbDeleteProduct } from "../lib/api";
import { getStoredProducts, setStoredProducts } from "../lib/products";
import { formatPrice } from "../lib/format";
import type { Product } from "../types";
import "./AdminProducts.css";

const EMPTY_PRODUCT: Omit<Product, "id" | "created_at"> = {
  name: "",
  description: "",
  price: 0,
  image_url: "",
  category: "Dresses",
  sizes: ["S", "M", "L"],
  colors: ["Black"],
  in_stock: true,
  featured: false,
};

const CATEGORIES = ["Dresses", "Tops", "Bottoms", "Accessories"];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const dbProducts = await dbGetProducts();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        setStoredProducts(dbProducts);
        return;
      }
      const stored = getStoredProducts();
      setProducts(stored);
    }
    load();
  }, []);

  const save = (updated: Product[]) => {
    setProducts(updated);
    setStoredProducts(updated);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setSizesInput("S, M, L");
    setColorsInput("Black");
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image_url: p.image_url,
      category: p.category,
      sizes: [...p.sizes],
      colors: [...p.colors],
      in_stock: p.in_stock,
      featured: p.featured,
    });
    setSizesInput(p.sizes.join(", "));
    setColorsInput(p.colors.join(", "));
    setImagePreview(p.image_url);
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("Image must be under 500KB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm({ ...form, image_url: result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);

    if (editing) {
      const updated = await dbUpdateProduct(editing.id, { ...form, sizes, colors });
      if (updated) {
        save(products.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const local: Product = { ...form, id: editing.id, sizes, colors, created_at: editing.created_at };
        save(products.map((p) => (p.id === editing.id ? local : p)));
      }
    } else {
      const created = await dbCreateProduct({ ...form, sizes, colors });
      if (created) {
        save([created, ...products]);
      } else {
        const local: Product = {
          ...form,
          id: `prod-${Date.now()}`,
          sizes,
          colors,
          created_at: new Date().toISOString(),
        };
        save([local, ...products]);
      }
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const ok = await dbDeleteProduct(id);
    save(products.filter((p) => p.id !== id));
    void ok;
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products page-enter">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title anim-fade-up visible">Products</h1>
          <p className="admin-page-sub anim-fade-up stagger-1 visible">{products.length} products total</p>
        </div>
        <button className="btn-add btn-ripple btn-shine" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="products-toolbar anim-fade-up stagger-2 visible">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input hover-border"
        />
      </div>

      <div className="products-table-wrap anim-fade-up stagger-3 visible">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td data-label="Product">
                  <div className="product-cell">
                    <img src={p.image_url} alt={p.name} className="product-thumb" />
                    <span className="product-cell-name">{p.name}</span>
                  </div>
                </td>
                <td data-label="Category"><span className="category-badge">{p.category}</span></td>
                <td data-label="Price" className="price-cell">{formatPrice(p.price)}</td>
                <td data-label="Sizes"><span className="sizes-text">{p.sizes.join(", ")}</span></td>
                <td data-label="Stock">
                  <span className={`stock-badge ${p.in_stock ? "in" : "out"}`}>
                    {p.in_stock ? "In Stock" : "Out"}
                  </span>
                </td>
                <td data-label="Featured">{p.featured ? "⭐" : ""}</td>
                <td data-label="">
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay anim-fade visible" onClick={() => setShowModal(false)}>
          <div className="modal modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Edit Product" : "Add Product"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Image Upload */}
              <div className="form-group">
                <label>Product Image</label>
                <div
                  className="image-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">
                      <span className="upload-icon">📷</span>
                      <p>Click to upload image</p>
                      <p className="upload-hint">Max 500KB (JPG, PNG)</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden-file-input"
                />
                <p className="image-url-hint">Or paste image URL below:</p>
                <input
                  value={imagePreview.startsWith("data:") ? "" : form.image_url}
                  onChange={(e) => {
                    setForm({ ...form, image_url: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="url-input"
                />
              </div>

              {/* Name */}
              <div className="form-group">
                <label>Product Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Floral Summer Dress"
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label>Price (NRS)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..."
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <div className="category-chips">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`category-chip ${form.category === c ? "active" : ""}`}
                      onClick={() => setForm({ ...form, category: c })}
                    >
                      {c === "Dresses" && "👗 "}
                      {c === "Tops" && "👚 "}
                      {c === "Bottoms" && "👖 "}
                      {c === "Accessories" && "👜 "}
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="form-group">
                <label>Sizes</label>
                <input
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="S, M, L, XL"
                />
              </div>

              {/* Colors */}
              <div className="form-group">
                <label>Colors</label>
                <input
                  value={colorsInput}
                  onChange={(e) => setColorsInput(e.target.value)}
                  placeholder="Black, White, Pink"
                />
              </div>

              {/* Toggles */}
              <div className="form-row checks">
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                  />
                  In Stock
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
