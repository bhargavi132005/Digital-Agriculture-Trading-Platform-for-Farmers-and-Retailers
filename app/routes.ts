import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("register-retailer", "routes/register-retailer.tsx"),
  route("products", "routes/events.tsx"),
  route("add-products", "routes/add-products.tsx"),
  route("orders", "routes/orders.tsx"),
] satisfies RouteConfig;
