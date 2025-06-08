import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage/HomePage.tsx';
import { ProductsPage } from './pages/ProductsPage/ProductsPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage/ProductDetailPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage/CategoriesPage.tsx';
import { CategoryDetailPage } from './pages/CategoryDetailPage/CategoryDetailPage.tsx';
import { LoginPage } from './pages/AuthPages/LoginPage.tsx';
import { RegisterPage } from './pages/AuthPages/RegisterPage.tsx';
import { CartPage } from './pages/CartPage/CartPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from "./pages/FavoritesPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage.tsx";
import { AdminProductsPage, AdminCategoriesPage, AdminOrdersPage } from './pages/AdminPages';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route index element={<HomePage />} />
                
                {/* Authentication routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="favorites" element={<FavoritesPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                </Route>
                
                {/* Admin routes */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="admin/products" element={<AdminProductsPage />} />
                  <Route path="admin/categories" element={<AdminCategoriesPage />} />
                  <Route path="admin/orders" element={<AdminOrdersPage />} />
                </Route>
                
                {/* Product routes */}
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:id" element={<CategoryDetailPage />} />
                
                {/* Catch all route (404) */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
