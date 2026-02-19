import { API_BASE } from './config';
import type { ApiErrorResponse } from '../types/product';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: ApiErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await parseResponse<ApiErrorResponse | T>(response);

  if (!response.ok) {
    const err = body as ApiErrorResponse;
    throw new ApiError(
      err?.message ?? `Request failed with status ${response.status}`,
      response.status,
      err
    );
  }

  return body as T;
}
