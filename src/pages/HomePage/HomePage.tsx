import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { mockCategories, mockProducts } from '../../data/mockData.ts';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';

export const HomePage = () => {
  // Берем последние 4 продукта для секции "Новинки"
  const latestProducts = [...mockProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

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
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className={styles.categoryCard}
            >
              <img
                src={category.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={category.name}
                className={styles.categoryImage}
              />
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>
                  {category.description || 'Исследуйте нашу коллекцию товаров в этой категории'}
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