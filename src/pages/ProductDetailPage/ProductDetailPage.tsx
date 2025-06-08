import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button.tsx';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';
import styles from './ProductDetailPage.module.css';
import classNames from 'classnames';
import { useCart } from '../../contexts/CartContext.tsx';
import { productService } from '../../services/productService.ts';

import type { Product, ReviewWithUser, FavoriteWithProduct } from '../../types/models.ts';

type TabType = 'description' | 'reviews';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [productReviews, setProductReviews] = useState<ReviewWithUser[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Эффект для загрузки продукта и связанных данных
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    const fetchProductData = async () => {
      try {
        // Загружаем данные о продукте
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Загружаем отзывы о продукте
        const reviews = await productService.getProductReviews(id);
        setProductReviews(reviews);
        
        // Загружаем избранное пользователя
        try {
          const favoritesData = await productService.getFavorites();
          setFavorites(favoritesData.favorites);
          
          // Проверяем, находится ли текущий товар в избранном
          const isInFavorites = favoritesData.favorites.some(f => f.product_id === id);
          setIsFavorite(isInFavorites);
        } catch (favError) {
          console.error('Ошибка при загрузке избранного:', favError);
          // Не показываем ошибку пользователю, так как это не критично
        }
        
        // Загружаем похожие товары (из той же категории)
        try {
          const similarProducts = await productService.getProductsByCategory(productData.category_id, 0, 4);
          // Фильтруем, чтобы исключить текущий товар
          const filtered = similarProducts.filter(p => p.id !== id);
          setSimilarProducts(filtered.slice(0, 4)); // Берем только первые 4
        } catch (similarError) {
          console.error('Ошибка при загрузке похожих товаров:', similarError);
          // Не показываем ошибку пользователю, так как это не критично
        }
      } catch (err) {
        console.error('Ошибка при загрузке товара:', err);
        setError('Не удалось загрузить информацию о товаре');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка товара...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Товар не найден</h2>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Вернуться к списку товаров
        </Button>
      </div>
    );
  }
  
  const isLowStock = product.stock <= 5;
  
  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await productService.removeFromFavorites(product.id);
      } else {
        await productService.addToFavorites(product.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(`Ошибка при ${isFavorite ? 'удалении из' : 'добавлении в'} избранное:`, error);
    }
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
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
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
        <span>{product.title}</span>
      </div>
      
      <div className={styles.productContainer}>
        <div className={styles.imageContainer}>
          <img 
            src={product.image_url || 'https://via.placeholder.com/600x400?text=No+Image'} 
            alt={product.title} 
            className={styles.image} 
          />
        </div>
        
        <div className={styles.details}>
          <h1 className={styles.title}>{product.title}</h1>
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
                        <span className={styles.reviewAuthor}>{review.username}</span>
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
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      )}
    </div>
  );
}; 