export type ProductStatus = 'Active' | 'Draft' | 'Archived';

export interface Product {
  id: string | number;
  name: string;
  sku?: string;
  category: string;
  price: number;
  status: ProductStatus;
  createdAt: string;
  description?: string;
  stock?: number;
  iconType?: 'laptop' | 'cloud' | 'headset' | 'phone' | 'keyboard' | 'monitor' | 'chair' | 'clothing' | 'watch' | 'default';
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt'> & {
  createdAt?: string;
};

export interface CategoryInfo {
  id: string;
  name: string;
  itemCount: number;
  description: string;
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'added' | 'updated' | 'deleted' | 'category_created';
  title: string;
  description: string;
  timeAgo: string;
  actor: string;
}

export interface ProductStats {
  totalProducts: number;
  totalChange: string;
  activeProducts: number;
  activePercentage: string;
  categoryCount: number;
  categoriesAdded: string;
  averagePrice: number;
  priceChange: string;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastNotification {
  id: string;
  message: string;
  type: ToastType;
}
