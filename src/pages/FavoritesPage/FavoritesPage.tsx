import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Button } from '../../components/common/Button';
import { productService } from '../../services/productService';
import type { Product, FavoriteWithProduct } from '../../types/models';
import styles from './FavoritesPage.module.css';

export const FavoritesPage = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  
  // Если не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await productService.getFavorites();
        setFavorites(response.favorites);
      } catch (err) {
        console.error('Ошибка при загрузке избранного:', err);
        setError('Не удалось загрузить избранные товары. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user]);
  
  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Загрузка данных пользователя...</div>;
  }
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка избранного...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  // Получаем только товары из избранного
  const favoriteProducts = favorites.map(fav => fav.product);
  
  const handleToggleFavorite = async (productId: string) => {
    if (processingIds.includes(productId)) return;
    
    setProcessingIds(prev => [...prev, productId]);
    
    try {
      await productService.removeFromFavorites(productId);
      setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
    } catch (err) {
      console.error('Ошибка при удалении из избранного:', err);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== productId));
    }
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранные товары</h1>
      
      {favorites.length > 0 ? (
        <ProductGrid 
          products={favoriteProducts} 
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <div className={styles.noFavorites}>
          <p>У вас пока нет избранных товаров</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/products'}
          >
            Перейти к каталогу
          </Button>
        </div>
      )}
    </div>
  );
}; 