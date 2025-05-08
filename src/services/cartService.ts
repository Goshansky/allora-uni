import { apiService } from './api';
import type { Cart, CartItemCreate, Order, OrderCreate } from '../types/models';

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
  removeFromCart: async (productId: number): Promise<Cart> => {
    return apiService.post<Cart>('/cart/remove', { product_id: productId });
  },

  /**
   * Update the quantity of a product in the cart
   */
  updateCartItem: async (item: CartItemCreate): Promise<Cart> => {
    // First remove the item
    await apiService.post('/cart/remove', { product_id: item.product_id });
    // Then add it with the new quantity
    return apiService.post<Cart>('/cart/add', item);
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
  createOrder: async (orderData: OrderCreate): Promise<Order> => {
    return apiService.post<Order>('/orders', orderData);
  },

  /**
   * Get all orders for the current user
   */
  getOrders: async (): Promise<Order[]> => {
    return apiService.get<Order[]>('/orders');
  },

  /**
   * Get a specific order by ID
   */
  getOrderById: async (orderId: number): Promise<Order> => {
    return apiService.get<Order>(`/orders/${orderId}`);
  }
}; 