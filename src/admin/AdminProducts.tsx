import { useEffect, useState } from "react";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import { dbGetProducts, dbCreateProduct, dbUpdateProduct, dbDeleteProduct } from "../lib/api";
import { getStoredProducts, setStoredProducts } from "../lib/products";
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

  useEffect(() => {
    async function load() {
      // Try fetching from database first
      const dbProducts = await dbGetProducts();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        setStoredProducts(dbProducts); // sync localStorage
        return;
      }
      // Fallback to localStorage
      let stored = getStoredProducts();
      if (stored.length === 0) {
        stored = SAMPLE_PRODUCTS;
        setStoredProducts(stored);
      }
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
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);

    if (editing) {
      // Try API first
      const updated = await dbUpdateProduct(editing.id, { ...form, sizes, colors });
      if (updated) {
        const next = products.map((p) => (p.id === editing.id ? updated : p));
        save(next);
      } else {
        // Fallback: update locally
        const local: Product = { ...form, id: editing.id, sizes, colors, created_at: editing.created_at };
        save(products.map((p) => (p.id === editing.id ? local : p)));
      }
    } else {
      // Try API first
      const created = await dbCreateProduct({ ...form, sizes, colors });
      if (created) {
        save([created, ...products]);
      } else {
        // Fallback: create locally
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
    // Always remove locally regardless of API result
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
                <td>
                  <div className="product-cell">
                    <img src={p.image_url} alt={p.name} className="product-thumb" />
                    <span className="product-cell-name">{p.name}</span>
                  </div>
                </td>
                <td><span className="category-badge">{p.category}</span></td>
                <td className="price-cell">${p.price.toFixed(2)}</td>
                <td><span className="sizes-text">{p.sizes.join(", ")}</span></td>
                <td>
                  <span className={`stock-badge ${p.in_stock ? "in" : "out"}`}>
                    {p.in_stock ? "In Stock" : "Out"}
                  </span>
                </td>
                <td>{p.featured ? "⭐" : ""}</td>
                <td>
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
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sizes (comma separated)</label>
                  <input value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Colors (comma separated)</label>
                  <input value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} />
                </div>
              </div>
              <div className="form-row checks">
                <label className="check-label">
                  <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} />
                  In Stock
                </label>
                <label className="check-label">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
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
