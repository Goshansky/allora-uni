import { apiService } from './api';
import type { 
  Product, 
  Category,
  CategoryWithProductsCount,
  CategoryCreate,
  CategoryUpdate,
  ProductCreate,
  ProductUpdate,
  ReviewWithUser,
  ReviewCreate,
  FavoriteWithProduct,
  FavoritesList
} from '../types/models';

export const productService = {
  /**
   * Get all products with pagination
   */
  getProducts: async (
    skip: number = 0, 
    limit: number = 100, 
    categoryId?: string
  ): Promise<Product[]> => {
    const params: Record<string, string | number> = { 
      skip, 
      limit 
    };
    
    if (categoryId) {
      params.category_id = categoryId;
    }
    
    return apiService.get<Product[]>('/products', { params });
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: string): Promise<Product> => {
    return apiService.get<Product>(`/products/${id}`);
  },

  /**
   * Create a new product (admin only)
   */
  createProduct: async (productData: ProductCreate): Promise<Product> => {
    return apiService.post<Product>('/products', productData);
  },

  /**
   * Update a product (admin only)
   */
  updateProduct: async (id: string, productData: ProductUpdate): Promise<Product> => {
    return apiService.put<Product>(`/products/${id}`, productData);
  },

  /**
   * Delete a product (admin only)
   */
  deleteProduct: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/products/${id}`);
  },

  /**
   * Get all categories with product counts
   */
  getCategories: async (skip: number = 0, limit: number = 100): Promise<CategoryWithProductsCount[]> => {
    return apiService.get<CategoryWithProductsCount[]>('/categories', {
      params: { skip, limit }
    });
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    return apiService.get<Category>(`/categories/${id}`);
  },

  /**
   * Create a new category (admin only)
   */
  createCategory: async (categoryData: CategoryCreate): Promise<Category> => {
    return apiService.post<Category>('/categories', categoryData);
  },

  /**
   * Update a category (admin only)
   */
  updateCategory: async (id: string, categoryData: CategoryUpdate): Promise<Category> => {
    return apiService.put<Category>(`/categories/${id}`, categoryData);
  },

  /**
   * Delete a category (admin only)
   */
  deleteCategory: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/categories/${id}`);
  },

  /**
   * Get products by category ID
   */
  getProductsByCategory: async (
    categoryId: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<Product[]> => {
    return apiService.get<Product[]>(
      `/categories/${categoryId}/products`,
      { params: { skip, limit } }
    );
  },

  /**
   * Get reviews for a product
   */
  getProductReviews: async (productId: string, skip: number = 0, limit: number = 100): Promise<ReviewWithUser[]> => {
    return apiService.get<ReviewWithUser[]>(`/reviews/${productId}`, {
      params: { skip, limit }
    });
  },

  /**
   * Create a review for a product
   */
  createReview: async (productId: string, reviewData: ReviewCreate): Promise<ReviewWithUser> => {
    return apiService.post<ReviewWithUser>(`/reviews/${productId}`, reviewData);
  },

  /**
   * Delete a review for a product
   */
  deleteReview: async (productId: string): Promise<void> => {
    return apiService.delete<void>(`/reviews/${productId}`);
  },

  /**
   * Get user's favorite products
   */
  getFavorites: async (): Promise<FavoritesList> => {
    return apiService.get<FavoritesList>('/favorites');
  },

  /**
   * Add a product to favorites
   */
  addToFavorites: async (productId: string): Promise<FavoriteWithProduct> => {
    return apiService.post<FavoriteWithProduct>(`/favorites/${productId}`);
  },

  /**
   * Remove a product from favorites
   */
  removeFromFavorites: async (productId: string): Promise<void> => {
    return apiService.delete<void>(`/favorites/${productId}`);
  }
}; 