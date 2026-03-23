import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { createProduct } from "~/services/products";
import AuthGuard from "~/components/AuthGuard";
import { useAuth } from "~/context/AuthContext";

export function meta() {
  return [
    { title: "Add Product | SmartX AgriTrade" },
    { name: "description", content: "List a new product for sale" },
  ];
}

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Spices",
  "Pulses",
  "Other"
];

function AddProductContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    unit: "kg",
    availableQuantity: "",
    minOrderQty: "1",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not a farmer
  if (!user?.role?.includes("FARMER")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Only farmers can list products.</p>
          <Link to="/" className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user?.id) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
    }

    try {
      await createProduct({
        farmerId: String(user.id), // Pass the farmer's ID
        name: form.name,
        category: form.category,
        price: Number(form.price),
        unit: form.unit,
        availableQuantity: Number(form.availableQuantity),
        minOrderQty: Number(form.minOrderQty),
        description: form.description,
        status: "ACTIVE"
      });
      navigate("/products");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in the details to list your produce on the marketplace.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 m-6 mb-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="name" className={labelClass}>Product Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Organic Tomatoes"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>Category</label>
                <select
                  id="category"
                  required
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className={labelClass}>Price (per unit)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    className={`${inputClass} pl-7`}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="availableQuantity" className={labelClass}>Available Quantity</label>
                <input
                  type="number"
                  id="availableQuantity"
                  required
                  min="0"
                  value={form.availableQuantity}
                  onChange={(e) => update("availableQuantity", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label htmlFor="unit" className={labelClass}>Unit</label>
                <input
                  type="text"
                  id="unit"
                  required
                  value={form.unit}
                  onChange={(e) => update("unit", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. kg, boxes, tons"
                />
              </div>

              <div>
                <label htmlFor="minOrderQty" className={labelClass}>Minimum Order Quantity</label>
                <input
                  type="number"
                  id="minOrderQty"
                  required
                  min="1"
                  value={form.minOrderQty}
                  onChange={(e) => update("minOrderQty", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe your product..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Link
                to="/products"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <AuthGuard>
      <AddProductContent />
    </AuthGuard>
  );
}