import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';
import { productService } from '../../services/productService.ts';
import type { Product, Category, CategoryWithProductsCount, FavoriteWithProduct } from '../../types/models.ts';
import styles from './CategoryDetailPage.module.css';

// Карта изображений для категорий
const CATEGORY_IMAGES: Record<string, string> = {
  // Основные категории
  'Электроника': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjQ_qoaLN2M7hanUrhfRbAEjmWK865qCFY-w&s',
  'Одежда': 'https://cs11.pikabu.ru/post_img/big/2020/01/04/7/1578136030153235220.jpg',
  'Книги': 'https://xn----8sbbfh8b2b9azcl.xn--p1ai/images/2021-12-07/scale_1200.png',
  
  // Подкатегории электроники
  'Ноутбуки': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDaq-6K3QNcO_znpKFYcGzpg_Lzc9zALrwUQ&s',
  'Смартфоны': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-KO1Rt41NoxzLw1-YvPaaOpwWcY88lVGVg&s',
  
  // Подкатегории одежды
  'Мужская одежда': 'https://med-online.ru/upload/webp/100/upload/iblock/165/h95ifnbp8eb0qj5x1osrimdgmbftvj12.webp',
  'Женская одежда': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7mRXJGDpexRZXyoA9n3v8ZAwCQaNXL-wTMA&s',
  
  // Подкатегории книг
  'Художественная литература': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvKWuAnp9rLl_dkE-F64dsBzt8rxzbxrsXhw&s',
  'Учебная литература': 'https://libume.ru/media/attaches/page/knizhnyi_klub_bibliograf_rekomenduet_novinki_ucheb_lit/4d5e29e24d5a470188495b8fe3bb17e0_%D0%B2%D1%8B%D1%88%D0%BA%D0%B0.jfif'
};

// Функция для получения изображения категории
const getCategoryImage = (categoryName: string): string => {
  return CATEGORY_IMAGES[categoryName] || 
    `https://via.placeholder.com/300x200?text=${encodeURIComponent(categoryName)}`;
};

export const CategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<CategoryWithProductsCount[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Загружаем информацию о категории
        const categoryData = await productService.getCategoryById(id);
        setCategory(categoryData);
        
        // Загружаем все категории для поиска подкатегорий
        const allCategories = await productService.getCategories();
        const subCats = allCategories.filter(cat => cat.parent_id === id);
        setSubcategories(subCats);
        
        // Загружаем товары текущей категории
        const currentCategoryProducts = await productService.getProductsByCategory(id);
        
        // Загружаем товары всех подкатегорий
        const subcategoryProductsPromises = subCats.map(subcat => 
          productService.getProductsByCategory(subcat.id)
        );
        
        // Ждем загрузки товаров всех подкатегорий
        const subcategoryProductsArrays = await Promise.all(subcategoryProductsPromises);
        
        // Объединяем товары текущей категории и всех подкатегорий
        const allProducts = [
          ...currentCategoryProducts,
          ...subcategoryProductsArrays.flat()
        ];
        
        setProducts(allProducts);
        
        // Загружаем избранное пользователя
        try {
          const favoritesData = await productService.getFavorites();
          setFavorites(favoritesData.favorites);
        } catch (favError) {
          console.error('Ошибка при загрузке избранного:', favError);
          // Не показываем ошибку пользователю, так как это не критично
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных категории:', err);
        setError('Не удалось загрузить информацию о категории');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleToggleFavorite = async (productId: string) => {
    try {
      const isFavorite = favorites.some(f => f.product_id === productId);
      
      if (isFavorite) {
        await productService.removeFromFavorites(productId);
        setFavorites(prev => prev.filter(f => f.product_id !== productId));
      } else {
        const newFavorite = await productService.addToFavorites(productId);
        setFavorites(prev => [...prev, newFavorite]);
      }
    } catch (error) {
      console.error('Ошибка при обновлении избранного:', error);
    }
  };
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка категории...</div>;
  }
  
  if (error || !category) {
    return (
      <div className={styles.error}>
        <p>{error || 'Категория не найдена'}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/categories')}
        >
          Вернуться к списку категорий
        </button>
      </div>
    );
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
        <div className={styles.categoryImage}>
          <img 
            src={getCategoryImage(category.name)} 
            alt={category.name} 
          />
        </div>
        <h1 className={styles.title}>{category.name}</h1>
      </div>
      
      {/* Отображаем подкатегории, если они есть */}
      {subcategories.length > 0 && (
        <div className={styles.subcategories}>
          <h2 className={styles.subcategoriesTitle}>Подкатегории</h2>
          <div className={styles.subcategoriesList}>
            {subcategories.map(subcat => (
              <Link 
                key={subcat.id} 
                to={`/categories/${subcat.id}`}
                className={styles.subcategoryCard}
              >
                <div className={styles.subcategoryImageContainer}>
                  <img 
                    src={getCategoryImage(subcat.name)} 
                    alt={subcat.name} 
                    className={styles.subcategoryImage}
                  />
                </div>
                <div className={styles.subcategoryInfo}>
                  <h3>{subcat.name}</h3>
                  <span className={styles.productCount}>
                    {subcat.products_count} товаров
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.content}>
        <h2 className={styles.productsTitle}>
          Товары в категории {subcategories.length > 0 ? 'и подкатегориях' : ''}
        </h2>
        {products.length > 0 ? (
          <ProductGrid 
            products={products} 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
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