import { apiService } from './api';
import type { 
  Product, 
  Category, 
  PaginatedResponse, 
  Review,
  ReviewCreate,
  Favorite
} from '../types/models';

export const productService = {
  /**
   * Get all products with pagination
   */
  getProducts: async (
    page: number = 1, 
    limit: number = 10, 
    categoryId?: number,
    search?: string
  ): Promise<PaginatedResponse<Product>> => {
    const params: Record<string, string | number> = { 
      page, 
      limit 
    };
    
    if (categoryId) {
      params.category_id = categoryId;
    }
    
    if (search) {
      params.search = search;
    }
    
    return apiService.get<PaginatedResponse<Product>>('/products', { params });
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: number): Promise<Product> => {
    return apiService.get<Product>(`/products/${id}`);
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    return apiService.get<Category[]>('/categories');
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (id: number): Promise<Category> => {
    return apiService.get<Category>(`/categories/${id}`);
  },

  /**
   * Get products by category ID
   */
  getProductsByCategory: async (
    categoryId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> => {
    return apiService.get<PaginatedResponse<Product>>(
      `/categories/${categoryId}/products`,
      { params: { page, limit } }
    );
  },

  /**
   * Get reviews for a product
   */
  getProductReviews: async (productId: number): Promise<Review[]> => {
    return apiService.get<Review[]>(`/reviews/${productId}`);
  },

  /**
   * Create a review for a product
   */
  createReview: async (review: ReviewCreate): Promise<Review> => {
    return apiService.post<Review>(`/reviews/${review.product_id}`, review);
  },

  /**
   * Delete a review for a product
   */
  deleteReview: async (productId: number): Promise<void> => {
    return apiService.delete<void>(`/reviews/${productId}`);
  },

  /**
   * Get user's favorite products
   */
  getFavorites: async (): Promise<Favorite[]> => {
    return apiService.get<Favorite[]>('/favorites');
  },

  /**
   * Add a product to favorites
   */
  addToFavorites: async (productId: number): Promise<Favorite> => {
    return apiService.post<Favorite>(`/favorites/${productId}`);
  },

  /**
   * Remove a product from favorites
   */
  removeFromFavorites: async (productId: number): Promise<void> => {
    return apiService.delete<void>(`/favorites/${productId}`);
  }
}; 