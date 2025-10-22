const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ProductsParams {
  keywords: string;
  pageSize?: number;
}

export interface ProductOffersParams {
  condition?: 'New' | 'Used' | 'Refurbished';
}

export interface FeesEstimateParams {
  price: number;
}

export interface PaginationParams {
  pageToken: string;
  keywords: string;
}

// Create a service factory that takes the auth session
export const createAmazonApiService = (session: any) => {
  const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}/amazon${endpoint}`;

    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  };

  return {
    async getProducts(params: ProductsParams) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return request(`/products?${searchParams.toString()}`);
    },

    async getNextPage(params: PaginationParams) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return request(`/products/next?${searchParams.toString()}`);
    },

    async getPreviousPage(params: PaginationParams) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return request(`/products/previous?${searchParams.toString()}`);
    },

    async getProduct(asin: string, endpoint: string, marketplace: string) {
      const searchParams = new URLSearchParams({ endpoint, marketplace });
      return request(`/product/${encodeURIComponent(asin)}?${searchParams.toString()}`);
    },

    async getProductOffers(asin: string, params: ProductOffersParams) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return request(`/product/${encodeURIComponent(asin)}/offers?${searchParams.toString()}`);
    },

    async getFeesEstimate(asin: string, params: FeesEstimateParams) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return request(`/product/${encodeURIComponent(asin)}/fees?${searchParams.toString()}`);
    },

    async validateCredentials() {
      return request('/auth/validate', { method: 'POST' });
    }
  };
};