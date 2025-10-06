import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ProductCard.module.css';
import type { Product } from '../../types/models';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductCard = ({ 
  product, 
  isFavorite = false, 
  onToggleFavorite 
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const isLowStock = product.stock <= 5;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} 
          alt={product.title} 
          className="product-image" 
        />
        {/* Категория не содержится в объекте продукта, поэтому временно скрываем */}
        {/* <span className={styles.category}>{product.category.name}</span> */}
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          {product.price.toLocaleString()} ₽
        </div>
        
        <div className="product-footer">
          <span className={classNames("product-stock", { "low-stock": isLowStock })}>
            {isLowStock ? `Осталось ${product.stock} шт.` : 'В наличии'}
          </span>
          
          <div className="product-actions">
            {onToggleFavorite && (
              <button 
                className={classNames("product-action-button", { "favorite": isFavorite })}
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
            )}
            
            <button 
              className="product-action-button" 
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              aria-label="Добавить в корзину"
            >
              {isAddingToCart ? '...' : '🛒'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}; 