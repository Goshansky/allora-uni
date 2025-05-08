import { Link } from 'react-router-dom';
import { mockCategories } from '../../data/mockData.ts';
import styles from './CategoriesPage.module.css';

export const CategoriesPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Категории товаров</h1>
      
      <div className={styles.categoriesGrid}>
        {mockCategories.map(category => (
          <Link 
            to={`/categories/${category.id}`} 
            key={category.id} 
            className={styles.categoryCard}
          >
            <div className={styles.imageContainer}>
              <img 
                src={category.image_url || 'https://via.placeholder.com/400x300?text=Категория'} 
                alt={category.name} 
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <h2 className={styles.categoryName}>{category.name}</h2>
              <p className={styles.description}>{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 