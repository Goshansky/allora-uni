import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';
import { productService } from '../../services/productService.ts';
import type { Product, CategoryWithProductsCount } from '../../types/models.ts';

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

export const HomePage = () => {
  const [categories, setCategories] = useState<CategoryWithProductsCount[]>([]);
  const [mainCategories, setMainCategories] = useState<CategoryWithProductsCount[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Получаем все категории
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
        
        // Фильтруем только основные категории (без родительской категории)
        const mainCats = categoriesData.filter(cat => !cat.parent_id);
        
        // Вычисляем общее количество товаров для каждой основной категории
        // включая товары из всех подкатегорий
        const mainCatsWithTotalProducts = mainCats.map(mainCat => {
          // Находим все подкатегории текущей основной категории
          const subcategories = categoriesData.filter(cat => cat.parent_id === mainCat.id);
          
          // Считаем общее количество товаров в основной категории и всех её подкатегориях
          const totalProductsCount = mainCat.products_count + 
            subcategories.reduce((sum, subcat) => sum + subcat.products_count, 0);
          
          // Возвращаем обновленную категорию с общим количеством товаров
          return {
            ...mainCat,
            products_count: totalProductsCount
          };
        });
        
        setMainCategories(mainCatsWithTotalProducts);
        
        // Получаем последние продукты
        const productsData = await productService.getProducts(0, 4);
        setLatestProducts(productsData);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Добро пожаловать в AlloraUni</h1>
          <p className={styles.heroSubtitle}>
            Откройте для себя широкий ассортимент товаров на любой вкус
          </p>
          <Link to="/products" className={styles.ctaButton}>
            Начать покупки
          </Link>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Категории товаров</h2>
        <div className={styles.grid}>
          {mainCategories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className={styles.categoryCard}
            >
              <img
                src={getCategoryImage(category.name)}
                alt={category.name}
                className={styles.categoryImage}
              />
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>
                  {`Товаров в категории: ${category.products_count}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Новинки</h2>
        <ProductGrid products={latestProducts} />
        <div className={styles.viewAllContainer}>
          <Link to="/products?sort=newest" className={styles.viewAllLink}>
            Смотреть все новинки
          </Link>
        </div>
      </section>
    </div>
  );
}; 