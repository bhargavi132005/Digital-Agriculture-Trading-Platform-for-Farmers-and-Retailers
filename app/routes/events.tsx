import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import AuthGuard from "~/components/AuthGuard";
import { getProducts, type ProductResponse, type PagedResponse } from "~/services/products";

export function meta() {
  return [
    { title: "Products | SmartX AgriTrade" },
    { name: "description", content: "Browse agriculture products on the marketplace" },
  ];
}

const PAGE_SIZE = 6;
const SORT_OPTIONS = [
  { label: "Price: Low to High", sortBy: "price", direction: "asc" as const },
  { label: "Price: High to Low", sortBy: "price", direction: "desc" as const },
  { label: "Newest First", sortBy: "createdAt", direction: "desc" as const },
  { label: "Name A-Z", sortBy: "name", direction: "asc" as const },
];

function ProductsContent() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "available">("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getProducts(
      {
        page,
        size: PAGE_SIZE,
        sortBy,
        direction,
        available: filter === "available" ? true : undefined,
      },
      controller.signal
    )
      .then((data: PagedResponse) => {
        if (!controller.signal.aborted) {
          setProducts(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!controller.signal.aborted) {
          setError(err.response?.data?.message || "Failed to load products.");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [filter, page, sortBy, direction, retryCount]);

  // Reset to first page when filter or sort changes
  function handleFilterChange(newFilter: "all" | "available") {
    setFilter(newFilter);
    setPage(0);
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const option = SORT_OPTIONS[Number(e.target.value)];
    setSortBy(option.sortBy);
    setDirection(option.direction);
    setPage(0);
  }

  function fetchProducts() {
    setRetryCount((c) => c + 1);
  }

  function getCategoryColor(category: string) {
    switch (category?.toUpperCase()) {
      case "VEGETABLES":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "FRUITS":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "GRAINS":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "DAIRY":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "SPICES":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "PULSES":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    }
  }

  function getStatusColor(status: string) {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "SOLD_OUT":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "PENDING":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  }

  const currentSortIndex = SORT_OPTIONS.findIndex(
    (o) => o.sortBy === sortBy && o.direction === direction
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">SmartX AgriTrade</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/products"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                >
                  Products
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-700 dark:text-green-400 font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Browse and trade fresh agriculture products.
              {!loading && totalElements > 0 && (
                <span className="ml-1 text-gray-400 dark:text-gray-500">
                  ({totalElements} product{totalElements !== 1 ? "s" : ""})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-green-700 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => handleFilterChange("available")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "available"
                  ? "bg-green-700 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Available
            </button>
            <select
              value={currentSortIndex >= 0 ? currentSortIndex : 0}
              onChange={handleSortChange}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((option, i) => (
                <option key={i} value={i}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button onClick={fetchProducts} className="ml-auto text-red-600 dark:text-red-400 underline text-sm font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading products...</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {filter === "available"
                ? "No products are available right now. Check back later or view all products."
                : "No products have been listed yet. Be the first to add your produce!"}
            </p>
            {filter === "available" && (
              <button
                onClick={() => handleFilterChange("all")}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-800 transition-colors"
              >
                View all products
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                >
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-wrap gap-2">
                        {product.category && (
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                            {product.category.replace(/_/g, " ")}
                          </span>
                        )}
                        {product.status && (
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {product.status.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    )}

                    <div className="space-y-2.5">
                      {product.price != null && (
                        <div className="flex items-center gap-2.5 text-sm">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-lg font-bold text-green-700 dark:text-green-400">
                            ${product.price}/{product.unit || "kg"}
                          </span>
                        </div>
                      )}

                      {product.quantity != null && (
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>{product.quantity} {product.unit || "kg"} available</span>
                        </div>
                      )}

                      {product.location && (
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{product.location}</span>
                        </div>
                      )}

                      {product.farmerName && (
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{product.farmerName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <button className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-800 transition-colors">
                      Place Order
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalElements)} of {totalElements} products
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(0)}
                    disabled={page === 0}
                    className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i)
                    .filter((i) => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1)
                    .reduce<(number | "ellipsis")[]>((acc, i, idx, arr) => {
                      if (idx > 0 && arr[idx - 1] !== i - 1) acc.push("ellipsis");
                      acc.push(i);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "ellipsis" ? (
                        <span key={`e-${idx}`} className="px-2 text-gray-400 dark:text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === item
                              ? "bg-green-700 text-white shadow-sm"
                              : "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {item + 1}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPage(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <AuthGuard>
      <ProductsContent />
    </AuthGuard>
  );
}
