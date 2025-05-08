import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button.tsx';
import { useCart } from '../../contexts/CartContext.tsx';
import { mockCart } from '../../data/mockData.ts';
import styles from './CartPage.module.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, isLoading } = useCart();
  const [itemBeingUpdated, setItemBeingUpdated] = useState<number | null>(null);
  const [itemBeingRemoved, setItemBeingRemoved] = useState<number | null>(null);

  // Use mock data for now
  const cartData = cart || mockCart;

  const handleQuantityChange = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItemBeingUpdated(productId);
    try {
      await updateCartItem({ product_id: productId, quantity });
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setItemBeingUpdated(null);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    setItemBeingRemoved(productId);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    } finally {
      setItemBeingRemoved(null);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading && !cartData) {
    return <div className={styles.loading}>Загрузка корзины...</div>;
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h1 className={styles.title}>Ваша корзина пуста</h1>
        <p>Добавьте товары в корзину чтобы совершить покупку.</p>
        <Button onClick={() => navigate('/products')} variant="primary">
          Перейти к каталогу
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Корзина</h1>
      
      <div className={styles.cartGrid}>
        <div className={styles.cartItems}>
          {cartData.items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img 
                  src={item.product.image_url || 'https://via.placeholder.com/100x100?text=No+Image'} 
                  alt={item.product.name} 
                />
              </div>
              
              <div className={styles.itemDetails}>
                <Link to={`/products/${item.product.id}`} className={styles.itemName}>
                  {item.product.name}
                </Link>
                <div className={styles.itemCategory}>{item.product.category.name}</div>
                <div className={styles.itemPrice}>{item.product.price.toLocaleString()} ₽</div>
              </div>
              
              <div className={styles.itemActions}>
                <div className={styles.quantityControls}>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || itemBeingUpdated === item.product.id}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>
                    {itemBeingUpdated === item.product.id ? '...' : item.quantity}
                  </span>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock || itemBeingUpdated === item.product.id}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(item.product.id)}
                  disabled={itemBeingRemoved === item.product.id}
                >
                  {itemBeingRemoved === item.product.id ? '...' : 'Удалить'}
                </button>
              </div>
              
              <div className={styles.itemTotal}>
                {(item.product.price * item.quantity).toLocaleString()} ₽
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Итого</h2>
          
          <div className={styles.summaryRow}>
            <span>Товары ({cartData.items.reduce((sum, item) => sum + item.quantity, 0)} шт.):</span>
            <span>{cartData.total.toLocaleString()} ₽</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Доставка:</span>
            <span>Бесплатно</span>
          </div>
          
          <div className={styles.totalRow}>
            <span>Итого к оплате:</span>
            <span className={styles.totalPrice}>{cartData.total.toLocaleString()} ₽</span>
          </div>
          
          <Button 
            variant="primary" 
            fullWidth 
            size="large"
            onClick={handleCheckout}
          >
            Оформить заказ
          </Button>
          
          <Link to="/products" className={styles.continueShopping}>
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}; 