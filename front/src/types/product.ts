export interface FinancialProduct {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export type CreateProductPayload = FinancialProduct;

export interface UpdateProductPayload {
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface ProductsListResponse {
  data: FinancialProduct[];
}

export interface ProductSuccessResponse {
  message: string;
  data: FinancialProduct;
}

export interface ApiErrorResponse {
  name: string;
  message: string;
  errors?: Record<string, string[]>;
}
