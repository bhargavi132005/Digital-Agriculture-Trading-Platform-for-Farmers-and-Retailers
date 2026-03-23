import api from "./api";

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  retailerId?: number;
  farmerId: number;
  status: string;
  totalAmount?: number;
  notes?: string;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  farmerId: number;
  items: OrderItem[];
  notes?: string;
}

// 1. Create order API retailer
export const createOrder = async (retailerId: number, data: CreateOrderRequest): Promise<Order> => {
  const response = await api.post(`/api/v1/retailers/me/orders?retailerId=${retailerId}`, data);
  return response.data;
};

// 2. Orders for a farmer
export const getFarmerOrders = async (farmerId: number): Promise<Order[]> => {
  const response = await api.get(`/api/v1/retailers/me/orders/farmer?farmerId=${farmerId}`);
  return response.data;
};

// 3. Retailer get orders
export const getRetailerOrders = async (retailerId: number): Promise<Order[]> => {
  const response = await api.get(`/api/v1/retailers/me/orders/retailer?retailerId=${retailerId}`);
  return response.data;
};

// 4 & 5. Cancel or Accept order
export const updateOrderStatus = async (orderId: number, action: "confirm" | "cancel"): Promise<Order> => {
  const response = await api.patch(`/api/v1/retailers/me/orders/${orderId}/${action}`);
  return response.data;
};