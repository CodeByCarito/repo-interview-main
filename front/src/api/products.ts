import { apiRequest } from './client';
import type {
  FinancialProduct,
  ProductsListResponse,
  ProductSuccessResponse,
  UpdateProductPayload,
} from '../types/product';

const BASE = '/bp/products';

export const productsApi = {
  async getAll(): Promise<FinancialProduct[]> {
    const res = await apiRequest<ProductsListResponse>(BASE);
    return res.data ?? [];
  },

  async verifyIdExists(id: string): Promise<boolean> {
    const path = `${BASE}/verification/${encodeURIComponent(id)}`;
    return apiRequest<boolean>(path);
  },

  async create(payload: FinancialProduct): Promise<FinancialProduct> {
    const res = await apiRequest<ProductSuccessResponse>(BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async update(id: string, payload: UpdateProductPayload): Promise<FinancialProduct> {
    const res = await apiRequest<ProductSuccessResponse>(`${BASE}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<{ message: string }>(`${BASE}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
