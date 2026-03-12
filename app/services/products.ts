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

export interface PagedResponse {
  content: ProductResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ProductParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
  available?: boolean;
}

export async function getProducts(
  params: ProductParams = {},
  signal?: AbortSignal
): Promise<PagedResponse> {
  const queryParams: Record<string, string> = {};
  if (params.page != null) queryParams.page = String(params.page);
  if (params.size != null) queryParams.size = String(params.size);
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.direction) queryParams.direction = params.direction;
  if (params.available) queryParams.available = "true";
  const { data } = await api.get<PagedResponse>("/api/products", {
    params: queryParams,
    signal,
  });
  return data;
}
