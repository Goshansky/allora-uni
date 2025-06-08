import { apiService } from './api';
import type { 
  Cart, 
  CartItemCreate, 
  CartItemUpdate, 
  Order,
  OrderUpdate
} from '../types/models';

export const cartService = {
  /**
   * Get the current user's cart
   */
  getCart: async (): Promise<Cart> => {
    return apiService.get<Cart>('/cart');
  },

  /**
   * Add a product to the cart
   */
  addToCart: async (item: CartItemCreate): Promise<Cart> => {
    return apiService.post<Cart>('/cart/add', item);
  },

  /**
   * Remove a product from the cart
   */
  removeFromCart: async (productId: string): Promise<Cart> => {
    return apiService.post<Cart>(`/cart/remove?product_id=${productId}`);
  },

  /**
   * Update the quantity of a product in the cart
   */
  updateCartItem: async (productId: string, update: CartItemUpdate): Promise<Cart> => {
    return apiService.post<Cart>(`/cart/update?product_id=${productId}`, update);
  },

  /**
   * Clear the cart
   */
  clearCart: async (): Promise<Cart> => {
    return apiService.post<Cart>('/cart/clear');
  },

  /**
   * Create an order from the cart
   */
  createOrder: async (): Promise<Order> => {
    return apiService.post<Order>('/orders');
  },

  /**
   * Get all orders for the current user
   */
  getOrders: async (skip: number = 0, limit: number = 100): Promise<Order[]> => {
    return apiService.get<Order[]>('/orders', {
      params: { skip, limit }
    });
  },

  /**
   * Get a specific order by ID
   */
  getOrderById: async (orderId: string): Promise<Order> => {
    return apiService.get<Order>(`/orders/${orderId}`);
  },

  /**
   * Update order status (admin only)
   */
  updateOrder: async (orderId: string, orderData: OrderUpdate): Promise<Order> => {
    return apiService.put<Order>(`/orders/${orderId}`, orderData);
  }
}; 