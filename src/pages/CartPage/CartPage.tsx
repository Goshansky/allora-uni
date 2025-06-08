import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button.tsx';
import { useCart } from '../../contexts/CartContext.tsx';
import styles from './CartPage.module.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, isLoading } = useCart();
  const [itemBeingUpdated, setItemBeingUpdated] = useState<string | null>(null);
  const [itemBeingRemoved, setItemBeingRemoved] = useState<string | null>(null);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItemBeingUpdated(productId);
    try {
      await updateCartItem({ product_id: productId, quantity });
    } catch (error) {
      console.error('Ошибка при обновлении товара в корзине:', error);
    } finally {
      setItemBeingUpdated(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setItemBeingRemoved(productId);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Ошибка при удалении товара из корзины:', error);
    } finally {
      setItemBeingRemoved(null);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading && !cart) {
    return <div className={styles.loading}>Загрузка корзины...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы оформить заказ</p>
        <Link to="/products" className={styles.continueShoppingLink}>
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Корзина</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.items.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.productImage}>
                <img 
                  src={item.product.image_url || 'https://via.placeholder.com/100x100?text=No+Image'} 
                  alt={item.product.title} 
                />
              </div>
              
              <div className={styles.productInfo}>
                <Link to={`/products/${item.product.id}`} className={styles.productName}>
                  {item.product.title}
                </Link>
                <div className={styles.productPrice}>
                  {item.product.price.toLocaleString()} ₽
                </div>
              </div>
              
              <div className={styles.quantityControls}>
                <button 
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.product_id, Math.max(1, item.quantity - 1))}
                  disabled={itemBeingUpdated === item.product_id || item.quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantity}>
                  {itemBeingUpdated === item.product_id ? '...' : item.quantity}
                </span>
                <button 
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                  disabled={itemBeingUpdated === item.product_id}
                >
                  +
                </button>
              </div>
              
              <div className={styles.itemTotal}>
                {(item.product.price * item.quantity).toLocaleString()} ₽
              </div>
              
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveItem(item.product_id)}
                disabled={itemBeingRemoved === item.product_id}
              >
                {itemBeingRemoved === item.product_id ? '...' : '×'}
              </button>
            </div>
          ))}
        </div>
        
        <div className={styles.cartSummary}>
          <h2 className={styles.summaryTitle}>Итого</h2>
          
          <div className={styles.summaryRow}>
            <span>Товары ({cart.items.reduce((acc, item) => acc + item.quantity, 0)})</span>
            <span>{cart.total_price.toLocaleString()} ₽</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Доставка</span>
            <span>Бесплатно</span>
          </div>
          
          <div className={styles.summaryTotal}>
            <span>Итого</span>
            <span>{cart.total_price.toLocaleString()} ₽</span>
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleCheckout} 
            className={styles.checkoutButton}
          >
            Оформить заказ
          </Button>
          
          <Link to="/products" className={styles.continueShoppingLink}>
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}; 