import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService.ts';
import type { CategoryWithProductsCount } from '../../types/models.ts';
import styles from './CategoriesPage.module.css';

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

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryWithProductsCount[]>([]);
  const [rootCategoriesWithTotalProducts, setRootCategoriesWithTotalProducts] = useState<CategoryWithProductsCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
        
        // Получаем только корневые категории (без родителя)
        const rootCats = categoriesData.filter(category => !category.parent_id);
        
        // Вычисляем общее количество товаров для каждой основной категории
        // включая товары из всех подкатегорий
        const rootCatsWithTotalProducts = rootCats.map(rootCat => {
          // Находим все подкатегории текущей основной категории
          const subcategories = categoriesData.filter(cat => cat.parent_id === rootCat.id);
          
          // Считаем общее количество товаров в основной категории и всех её подкатегориях
          const totalProductsCount = rootCat.products_count + 
            subcategories.reduce((sum, subcat) => sum + subcat.products_count, 0);
          
          // Возвращаем обновленную категорию с общим количеством товаров
          return {
            ...rootCat,
            products_count: totalProductsCount
          };
        });
        
        setRootCategoriesWithTotalProducts(rootCatsWithTotalProducts);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setError('Не удалось загрузить категории. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Получаем подкатегории для заданной родительской категории
  const getSubcategories = (parentId: string) => {
    return categories.filter(category => category.parent_id === parentId);
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка категорий...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Категории товаров</h1>
      
      <div className={styles.categoriesGrid}>
        {rootCategoriesWithTotalProducts.map(category => (
          <div key={category.id} className={styles.categoryGroup}>
            <Link 
              to={`/categories/${category.id}`} 
              className={styles.categoryCard}
            >
              <div className={styles.imageContainer}>
                <img 
                  src={getCategoryImage(category.name)} 
                  alt={category.name} 
                  className={styles.image}
                />
              </div>
              <div className={styles.content}>
                <h2 className={styles.categoryName}>{category.name}</h2>
                <p className={styles.description}>Товаров: {category.products_count}</p>
              </div>
            </Link>

            {/* Отображаем подкатегории */}
            <div className={styles.subcategories}>
              {getSubcategories(category.id).map(subcategory => (
                <Link 
                  to={`/categories/${subcategory.id}`} 
                  key={subcategory.id} 
                  className={styles.subcategoryLink}
                >
                  {subcategory.name} ({subcategory.products_count})
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 