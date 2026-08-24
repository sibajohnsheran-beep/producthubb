import { Product, ProductFilterParams, PaginatedResult, ProductStats, CategoryInfo, ActivityItem, CreateProductInput } from '../types';
import { INITIAL_CATEGORIES, INITIAL_ACTIVITIES } from '../data/mockProducts';

// Configurable API base URL: defaults to relative '/api' for same-origin proxy/server, or localhost:5000 if configured
const API_BASE_URL = (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) || '/api';

const ACTIVITIES_KEY = 'producthub_activities_v1';

function getStoredActivities(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ACTIVITIES;
  }
}

function addLocalActivity(item: Omit<ActivityItem, 'id' | 'timeAgo'>) {
  try {
    const list = getStoredActivities();
    const newItem: ActivityItem = {
      ...item,
      id: 'act-' + Date.now(),
      timeAgo: 'Just now'
    };
    const updated = [newItem, ...list.slice(0, 19)];
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

/**
 * Product Service
 * Communicates directly with the Express REST API Backend
 */
export const productService = {
  /**
   * Fetch all products from GET /api/products and apply client-side pagination/filtering/sorting
   */
  async getProducts(params: ProductFilterParams = {}): Promise<PaginatedResult<Product>> {
    try {
      // Build query string
      const urlParams = new URLSearchParams();
      if (params.search && params.search.trim()) {
        urlParams.append('search', params.search.trim());
      }
      if (params.category && params.category !== 'all') {
        urlParams.append('category', params.category);
      }

      const queryString = urlParams.toString();
      const endpoint = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Failed to fetch products (HTTP ${res.status})`);
      }

      const json = await res.json();
      let list: Product[] = json.data || [];

      // Additional client-side status filter if specified
      if (params.status && params.status !== 'all') {
        const st = params.status.toLowerCase();
        list = list.filter(p => (p.status || '').toLowerCase() === st);
      }

      // Additional client-side sorting
      const sortBy = params.sortBy || 'newest';
      list.sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        }
        if (sortBy === 'price-asc') {
          return Number(a.price) - Number(b.price);
        }
        if (sortBy === 'price-desc') {
          return Number(b.price) - Number(a.price);
        }
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'name-desc') {
          return (b.name || '').localeCompare(a.name || '');
        }
        return 0;
      });

      const total = list.length;
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      const startIndex = (page - 1) * pageSize;
      const paginatedData = list.slice(startIndex, startIndex + pageSize);

      return {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (err: any) {
      console.error('Error fetching products from API:', err);
      throw err;
    }
  },

  /**
   * Fetch a single product by ID via GET /api/products/:id
   */
  async getProductById(id: string | number): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || `Product not found (HTTP ${res.status})`);
    }

    return json.data;
  },

  /**
   * Create a new product via POST /api/products
   */
  async createProduct(productData: CreateProductInput): Promise<Product> {
    const payload = {
      name: productData.name,
      category: productData.category,
      price: Number(productData.price),
      sku: productData.sku,
      status: productData.status || 'Active',
      description: productData.description || '',
      stock: productData.stock,
      iconType: productData.iconType,
      createdAt: productData.createdAt
    };

    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (json.errors) {
        const errorList = Object.values(json.errors).join(', ');
        throw new Error(errorList || json.message || 'Validation failed');
      }
      throw new Error(json.message || `Failed to create product (HTTP ${res.status})`);
    }

    const createdProduct = json.data;

    addLocalActivity({
      type: 'added',
      title: 'Product added',
      description: createdProduct.name,
      actor: 'Current User'
    });

    return createdProduct;
  },

  /**
   * Update an existing product via PUT /api/products/:id
   */
  async updateProduct(id: string | number, productData: Partial<Product>): Promise<Product> {
    const payload: Record<string, any> = { ...productData };
    if (payload.price !== undefined) {
      payload.price = Number(payload.price);
    }

    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (json.errors) {
        const errorList = Object.values(json.errors).join(', ');
        throw new Error(errorList || json.message || 'Validation failed');
      }
      throw new Error(json.message || `Failed to update product (HTTP ${res.status})`);
    }

    const updatedProduct = json.data;

    addLocalActivity({
      type: 'updated',
      title: 'Product updated',
      description: `Updated info for ${updatedProduct.name}`,
      actor: 'Current User'
    });

    return updatedProduct;
  },

  /**
   * Delete a product via DELETE /api/products/:id
   */
  async deleteProduct(id: string | number): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || `Failed to delete product (HTTP ${res.status})`);
    }

    addLocalActivity({
      type: 'deleted',
      title: 'Product deleted',
      description: `Product #${id} removed from catalog`,
      actor: 'Current User'
    });

    return { success: true, message: json.message || 'Product deleted successfully' };
  },

  /**
   * Get dynamic high-level catalog statistics from live API products
   */
  async getStats(): Promise<ProductStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const json = await res.json().catch(() => ({}));
      const list: Product[] = json.data || [];

      const totalProducts = list.length;
      const activeProducts = list.filter(p => p.status === 'Active').length;
      const activePercentage = totalProducts > 0 
        ? ((activeProducts / totalProducts) * 100).toFixed(1) + '%' 
        : '0%';

      const uniqueCategories = new Set(list.map(p => (p.category || '').toLowerCase()));
      const categoryCount = Math.max(INITIAL_CATEGORIES.length, uniqueCategories.size);

      const totalValue = list.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
      const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

      return {
        totalProducts,
        totalChange: '+12%',
        activeProducts,
        activePercentage,
        categoryCount,
        categoriesAdded: '+3 added',
        averagePrice,
        priceChange: '-2%'
      };
    } catch (e) {
      return {
        totalProducts: 0,
        totalChange: '0%',
        activeProducts: 0,
        activePercentage: '0%',
        categoryCount: 0,
        categoriesAdded: '0',
        averagePrice: 0,
        priceChange: '0%'
      };
    }
  },

  /**
   * Get category metadata with dynamically aggregated product counts
   */
  async getCategories(): Promise<CategoryInfo[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const json = await res.json().catch(() => ({}));
      const list: Product[] = json.data || [];

      return INITIAL_CATEGORIES.map(cat => {
        const count = list.filter(p => (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
        return {
          ...cat,
          itemCount: count > 0 ? count : cat.itemCount
        };
      });
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  },

  /**
   * Get recent product activities
   */
  async getRecentActivities(): Promise<ActivityItem[]> {
    return getStoredActivities();
  },

  /**
   * Reset data notification helper
   */
  resetToDefault(): void {
    localStorage.removeItem(ACTIVITIES_KEY);
  }
};
