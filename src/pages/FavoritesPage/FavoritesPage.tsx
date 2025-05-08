import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Button } from '../../components/common/Button';
import { mockFavorites } from '../../data/mockData';
import styles from './FavoritesPage.module.css';

export const FavoritesPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading || !user) {
    return <div className={styles.loading}>Загрузка избранного...</div>;
  }
  
  // Get user's favorites from mock data
  const userFavorites = mockFavorites.filter(fav => fav.user_id === user.id);
  const favoriteProducts = userFavorites.map(fav => fav.product);
  
  const handleToggleFavorite = async (productId: number) => {
    if (processingIds.includes(productId)) return;
    
    setProcessingIds(prev => [...prev, productId]);
    
    // Simulate API call to remove from favorites
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real application, we would call an API to remove from favorites
    console.log(`Removing product ${productId} from favorites`);
    
    setProcessingIds(prev => prev.filter(id => id !== productId));
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранные товары</h1>
      
      {favoriteProducts.length > 0 ? (
        <>
          <div className={styles.description}>
            Здесь хранятся товары, которые вы добавили в избранное. Вы можете добавить товар в корзину или удалить его из избранного.
          </div>
          
          <ProductGrid 
            products={favoriteProducts}
            favorites={userFavorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </>
      ) : (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>У вас пока нет избранных товаров</h2>
          <p className={styles.emptyDescription}>
            Добавляйте понравившиеся товары в избранное, чтобы не потерять их из виду.
          </p>
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