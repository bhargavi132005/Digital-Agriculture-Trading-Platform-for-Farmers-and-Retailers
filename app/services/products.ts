import api from "./api";

export interface ProductResponse {
  id: string;
  farmerId: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  unit?: string;
  availableQuantity: number;
  minOrderQty?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  farmerName?: string; // Optional UI helper property
  location?: string;   // Optional UI helper property
}

export interface CreateProductRequest {
  farmerId: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  unit?: string;
  availableQuantity: number;
  minOrderQty?: number;
  status?: string;
}

// --- FARMER PRODUCT ENDPOINTS ---

export async function createProduct(payload: CreateProductRequest): Promise<ProductResponse> {
  const { data } = await api.post<ProductResponse>("/farmers/me/products", payload);
  return data;
}

export async function getFarmerProducts(farmerId: string): Promise<ProductResponse[]> {
  const { data } = await api.get<ProductResponse[]>("/farmers/me/products", { params: { farmerId } });
  return data;
}

export async function updateProduct(productId: string, payload: Partial<CreateProductRequest>): Promise<ProductResponse> {
  const { data } = await api.put<ProductResponse>(`/farmers/me/products/${productId}`, payload);
  return data;
}

export async function deleteProduct(productId: string): Promise<string> {
  const { data } = await api.delete<string>(`/farmers/me/products/${productId}`);
  return data;
}

// --- RETAILER PRODUCT ENDPOINTS ---

export async function getProducts(params?: { available?: boolean, category?: string, name?: string }, signal?: AbortSignal): Promise<ProductResponse[]> {
  let url = "/retailers/products";
  
  // Route to specific endpoints based on search parameters
  if (params?.category) {
    url = "/retailers/products/category";
  } else if (params?.name) {
    url = "/retailers/products/search";
  }
  
  const { data } = await api.get<ProductResponse[]>(url, { params, signal });
  return data;
}