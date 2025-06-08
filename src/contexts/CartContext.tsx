import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import type { Cart, CartItemCreate, CartItemUpdate } from '../types/models';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (item: CartItemCreate) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, update: CartItemUpdate) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Не удалось загрузить корзину. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const addToCart = async (item: CartItemCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await cartService.addToCart(item);
      setCart(updatedCart);
    } catch (err) {
      setError('Не удалось добавить товар в корзину');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (err) {
      setError('Не удалось удалить товар из корзины');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId: string, update: CartItemUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await cartService.updateCartItem(productId, update);
      setCart(updatedCart);
    } catch (err) {
      setError('Не удалось обновить товар в корзине');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const emptyCart = await cartService.clearCart();
      setCart(emptyCart);
    } catch (err) {
      setError('Не удалось очистить корзину');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cart,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 