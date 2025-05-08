// User related types
export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// Product related types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock: number;
  category_id: number;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock: number;
  category_id: number;
}

// Category related types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  image_url?: string;
}

// Cart related types
export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemCreate {
  product_id: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order related types
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  order_id: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderCreate {
  items: CartItemCreate[];
  shipping_address: string;
}

// Review related types
export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewCreate {
  product_id: number;
  rating: number;
  comment: string;
}

// Favorite related types
export interface Favorite {
  id: number;
  product_id: number;
  product: Product;
  user_id: number;
  created_at: string;
}

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
} 