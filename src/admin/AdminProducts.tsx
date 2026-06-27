import { useEffect, useState } from "react";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
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

  useEffect(() => {
    const stored = localStorage.getItem("gg-admin-products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(SAMPLE_PRODUCTS);
      localStorage.setItem("gg-admin-products", JSON.stringify(SAMPLE_PRODUCTS));
    }
  }, []);

  const save = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem("gg-admin-products", JSON.stringify(updated));
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

  const handleSave = () => {
    const product: Product = {
      ...form,
      id: editing?.id || `prod-${Date.now()}`,
      sizes: sizesInput.split(",").map((s) => s.trim()).filter(Boolean),
      colors: colorsInput.split(",").map((c) => c.trim()).filter(Boolean),
      created_at: editing?.created_at || new Date().toISOString(),
    };
    if (editing) {
      save(products.map((p) => (p.id === editing.id ? product : p)));
    } else {
      save([product, ...products]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    save(products.filter((p) => p.id !== id));
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{products.length} products total</p>
        </div>
        <button className="btn-add" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="products-table-wrap">
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
              <button className="btn-save" onClick={handleSave}>{editing ? "Save Changes" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
