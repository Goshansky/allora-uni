import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';
import { mockCategories, mockProducts, mockFavorites } from '../../data/mockData.ts';
import styles from './CategoryDetailPage.module.css';

export const CategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const categoryId = id ? parseInt(id) : 0;
  
  const category = mockCategories.find(cat => cat.id === categoryId);
  const categoryProducts = mockProducts.filter(product => product.category_id === categoryId);
  
  useEffect(() => {
    // Имитация загрузки данных
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [categoryId]);
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка категории...</div>;
  }
  
  if (!category) {
    return <div className={styles.error}>Категория не найдена</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link to="/">Главная</Link>
        <span className={styles.navigationSeparator}>/</span>
        <Link to="/categories">Категории</Link>
        <span className={styles.navigationSeparator}>/</span>
        <span>{category.name}</span>
      </div>
      
      <div className={styles.header}>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.description}>{category.description}</p>
      </div>
      
      <div className={styles.content}>
        {categoryProducts.length > 0 ? (
          <ProductGrid 
            products={categoryProducts} 
            favorites={mockFavorites}
            onToggleFavorite={(productId) => console.log('Toggle favorite:', productId)}
          />
        ) : (
          <div className={styles.noProducts}>
            <p>В данной категории пока нет товаров.</p>
            <Link to="/products" className={styles.link}>
              Посмотреть все товары
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}; 