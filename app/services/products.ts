import api from "./api";

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  farmerId: string;
  farmerName: string;
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(
  available?: boolean,
  signal?: AbortSignal
): Promise<ProductResponse[]> {
  const params: Record<string, string> = {};
  if (available) params.available = "true";
  const { data } = await api.get<ProductResponse[]>("/api/products", {
    params,
    signal,
  });
  return data;
}
