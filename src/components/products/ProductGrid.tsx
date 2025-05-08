import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';
import type { Product, Favorite } from '../../types/models';

interface ProductGridProps {
  products: Product[];
  favorites?: Favorite[];
  onToggleFavorite?: (productId: number) => void;
}

export const ProductGrid = ({
  products,
  favorites = [],
  onToggleFavorite
}: ProductGridProps) => {
  const favoriteProductIds = favorites.map(fav => fav.product_id);

  if (products.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.noProducts}>
          Товары не найдены
        </div>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favoriteProductIds.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}; 