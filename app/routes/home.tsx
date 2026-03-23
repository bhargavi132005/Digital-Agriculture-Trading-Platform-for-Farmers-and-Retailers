import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import AuthGuard from "~/components/AuthGuard";
import { getFarmerOrders, getRetailerOrders } from "~/services/orders";
import { getFarmerProducts } from "~/services/products";

export function meta() {
  return [
    { title: "Dashboard | SmartX AgriTrade" },
    { name: "description", content: "Your agriculture trading dashboard" },
  ];
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const [tokenPayload, setTokenPayload] = useState<any>(null);
  const [stats, setStats] = useState({ pendingOrders: 0, sales: 0, activeTrades: 0, totalProducts: 0 });

  const isFarmer = String(user?.role || "").toUpperCase().includes("FARMER");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && token.includes('.')) {
      try {
        // Decode the middle section (payload) of the JWT token
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          setTokenPayload(JSON.parse(jsonPayload));
        }
      } catch(e) {
        console.error("Error decoding token:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchDashboardData = async () => {
      try {
        let totalProductsCount = 0;
        if (isFarmer) {
          try {
            const products: any = await getFarmerProducts(String(user.id));
            const pList = Array.isArray(products) ? products : (products?.content || products?.data || []);
            const deletedIds = JSON.parse(localStorage.getItem("deletedProducts") || "[]").map(String);
            totalProductsCount = pList.filter((p: any) => !deletedIds.includes(String(p.id))).length;
          } catch (e) {
            // fail silently if product fetch throws an error
          }
        }

        let allOrders: any[] = [];
        try {
          const data: any = await (isFarmer ? getFarmerOrders(Number(user.id)) : getRetailerOrders(Number(user.id)));
          allOrders = Array.isArray(data) ? data : (data?.content || data?.data || []);
        } catch (e) {
          // Intentionally fail silently here and fall back to local mock orders
        }
        
        const mockOrders = JSON.parse(localStorage.getItem("mockOrders") || "[]").filter((o:any) => isFarmer ? o.farmerId === Number(user.id) : o.retailerId === Number(user.id));
        allOrders = [...mockOrders, ...allOrders];
        
        const pendingOrders = allOrders.filter(o => o.status?.toUpperCase() === "PENDING").length;
        const activeTrades = allOrders.length;
        const sales = allOrders.filter(o => ["COMPLETED", "CONFIRMED"].includes(o.status?.toUpperCase())).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        setStats({ pendingOrders, activeTrades, sales, totalProducts: totalProductsCount });
      } catch(e) {}
    };
    fetchDashboardData();
  }, [user?.id, user?.role]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">SmartX AgriTrade</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-700 dark:text-green-400 font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{user?.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                  {user?.role?.replace("ROLE_", "") || "Farmer"}
                </span>
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
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Here's an overview of your agriculture trading dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{isFarmer ? "My Products" : "Total Orders"}</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{isFarmer ? stats.totalProducts : stats.activeTrades}</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Orders</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{isFarmer ? "Total Sales" : "Total Purchases"}</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.sales.toFixed(2)}</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Trades</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTrades}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{isFarmer ? "Manage your farm produce and trades." : "Browse products and manage your orders."}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {isFarmer && (
            <Link to="/add-products" className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Add Product</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">List a new crop for sale</div>
              </div>
            </Link>
            )}

            <Link to="/products" className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Browse Market</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">View all available products</div>
              </div>
            </Link>

            <Link to="/orders" className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">My Orders</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your trade orders</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.name || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.email || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.role?.replace("ROLE_", "") || "Farmer"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">User ID</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.id || "—"}</div>
            </div>
          </div>
          
          {/* JWT Decode Debugger */}
          {tokenPayload && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                JWT Token Payload (Debug)
              </h3>
              <p className="text-xs text-gray-500 mb-3">Check the claims below. If your Spring Boot backend expects exactly <code>"ROLE_RETAILER"</code> but the token only says <code>"RETAILER"</code>, it will cause a 403 Forbidden error.</p>
              <pre className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg overflow-x-auto text-xs text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                {JSON.stringify(tokenPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
