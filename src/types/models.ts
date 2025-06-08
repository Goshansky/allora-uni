// User related types
export interface User {
  id: string;
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
  email: string;
  password: string;
}

export interface UserUpdate {
  email?: string;
  username?: string;
  password?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// Product related types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  stock: number;
  category_id: string;
  created_at: string;
}

export interface ProductCreate {
  title: string;
  description: string;
  price: number;
  image_url?: string;
  stock: number;
  category_id: string;
}

export interface ProductUpdate {
  title?: string;
  description?: string;
  price?: number;
  image_url?: string;
  stock?: number;
  category_id?: string;
}

// Category related types
export interface Category {
  id: string;
  name: string;
  parent_id?: string;
}

export interface CategoryCreate {
  name: string;
  parent_id?: string;
}

export interface CategoryUpdate {
  name?: string;
  parent_id?: string;
}

export interface CategoryWithProductsCount extends Category {
  products_count: number;
}

// Cart related types
export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  user_id: string;
}

export interface CartItemCreate {
  product_id: string;
  quantity: number;
}

export interface CartItemUpdate {
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total_price: number;
}

// Order related types
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_price: number;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderUpdate {
  status: OrderStatus;
}

// Review related types
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  username: string;
}

export interface ReviewCreate {
  rating: number;
  comment: string;
}

// Favorite related types
export interface Favorite {
  id: string;
  product_id: string;
  user_id: string;
}

export interface FavoriteWithProduct extends Favorite {
  product: Product;
}

export interface FavoritesList {
  favorites: FavoriteWithProduct[];
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