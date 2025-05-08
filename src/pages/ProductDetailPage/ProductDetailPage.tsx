import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button.tsx';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';
import styles from './ProductDetailPage.module.css';
import classNames from 'classnames';
import { useCart } from '../../contexts/CartContext.tsx';

import { mockProducts, mockReviews, mockFavorites } from '../../data/mockData.ts';
import type { Product, Review } from '../../types/models.ts';

type TabType = 'description' | 'reviews';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Эффект для загрузки продукта
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    
    // В реальном приложении здесь был бы запрос к API
    const productId = parseInt(id);
    const foundProduct = mockProducts.find(p => p.id === productId);
    const reviews = mockReviews.filter(r => r.product_id === productId);
    
    // Проверяем, находится ли товар в избранном
    const isInFavorites = mockFavorites.some(f => f.product_id === productId);
    
    // Находим похожие товары (из той же категории)
    const similar = foundProduct
      ? mockProducts.filter(p => 
          p.category_id === foundProduct.category_id && 
          p.id !== foundProduct.id
        ).slice(0, 4)
      : [];
    
    setProduct(foundProduct || null);
    setProductReviews(reviews);
    setSimilarProducts(similar);
    setIsFavorite(isInFavorites);
    setIsLoading(false);
  }, [id]);
  
  if (isLoading) {
    return <div>Загрузка товара...</div>;
  }
  
  if (!product) {
    return <div>Товар не найден</div>;
  }
  
  const isLowStock = product.stock <= 5;
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // В реальном приложении здесь был бы запрос к API
    console.log(`${isFavorite ? 'Removing from' : 'Adding to'} favorites: ${product.id}`);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart({ product_id: product.id, quantity });
      // В реальном приложении здесь мог бы быть тост с успешным сообщением
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Форматирование даты для отзывов
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  // Отображение рейтинга в виде звезд
  const renderRating = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link to="/">Главная</Link>
        <span className={styles.navigationSeparator}>/</span>
        <Link to="/products">Товары</Link>
        <span className={styles.navigationSeparator}>/</span>
        <Link to={`/categories/${product.category_id}`}>{product.category.name}</Link>
        <span className={styles.navigationSeparator}>/</span>
        <span>{product.name}</span>
      </div>
      
      <div className={styles.productContainer}>
        <div className={styles.imageContainer}>
          <img 
            src={product.image_url || 'https://via.placeholder.com/600x400?text=No+Image'} 
            alt={product.name} 
            className={styles.image} 
          />
        </div>
        
        <div className={styles.details}>
          <div className={styles.category}>{product.category.name}</div>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>{product.price.toLocaleString()} ₽</div>
          
          <div className={classNames(styles.stock, { [styles.lowStock]: isLowStock })}>
            {product.stock > 0 
              ? isLowStock 
                ? `Осталось всего ${product.stock} шт.` 
                : 'В наличии'
              : 'Нет в наличии'}
          </div>
          
          {product.stock > 0 && (
            <div className={styles.quantitySelector}>
              <button 
                className={styles.quantityButton}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className={styles.quantityInput}
              />
              <button 
                className={styles.quantityButton}
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          )}
          
          <div className={styles.actionButtons}>
            <Button 
              variant="primary" 
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              isLoading={isAddingToCart}
            >
              {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleToggleFavorite}
            >
              {isFavorite ? 'Удалить из избранного' : 'В избранное'}
            </Button>
          </div>
          
          <div className={styles.tabs}>
            <button 
              className={classNames(styles.tab, { [styles.activeTab]: activeTab === 'description' })}
              onClick={() => setActiveTab('description')}
            >
              Описание
            </button>
            <button 
              className={classNames(styles.tab, { [styles.activeTab]: activeTab === 'reviews' })}
              onClick={() => setActiveTab('reviews')}
            >
              Отзывы ({productReviews.length})
            </button>
          </div>
          
          <div className={styles.tabContent}>
            {activeTab === 'description' ? (
              <div className={styles.description}>
                {product.description}
              </div>
            ) : (
              <div className={styles.reviews}>
                {productReviews.length > 0 ? (
                  productReviews.map(review => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewAuthor}>{review.user.username}</span>
                        <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>
                      </div>
                      <div className={styles.rating}>{renderRating(review.rating)}</div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.noReviews}>
                    Пока нет отзывов об этом товаре
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {similarProducts.length > 0 && (
        <div className={styles.similarProducts}>
          <h2 className={styles.similarProductsTitle}>Похожие товары</h2>
          <ProductGrid 
            products={similarProducts} 
            favorites={mockFavorites}
            onToggleFavorite={id => console.log('Toggle favorite:', id)}
          />
        </div>
      )}
    </div>
  );
}; 