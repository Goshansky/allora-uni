import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cartService } from '../../services/cartService';
import styles from './OrdersPage.module.css';
import type { Order } from '../../types/models';

export const OrdersPage = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Если не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Используем cartService для получения заказов
        const response = await cartService.getOrders();
        setOrders(response);
      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
        setError('Не удалось загрузить историю заказов. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Загрузка данных пользователя...</div>;
  }
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка заказов...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  // Форматирование даты в читаемый вид
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  // Перевод статуса заказа на русский язык
  const getOrderStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'В обработке',
      'paid': 'Оплачен',
      'shipped': 'Отправлен',
      'completed': 'Доставлен',
      'cancelled': 'Отменен'
    };
    
    return statusMap[status] || status;
  };
  
  // Получение класса для стилизации статуса
  const getStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      'pending': styles.statusPending,
      'paid': styles.statusPaid,
      'shipped': styles.statusShipped,
      'completed': styles.statusCompleted,
      'cancelled': styles.statusCancelled
    };
    
    return statusClassMap[status] || '';
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>История заказов</h1>
      
      {orders.length > 0 ? (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderNumber}>Заказ #{order.id.substring(0, 8)}</span>
                  <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                </div>
                <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </div>
              </div>
              
              <div className={styles.orderDetails}>
                {order.items && order.items.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.productInfo}>
                      <img 
                        src={item.product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'} 
                        alt={item.product.title}
                        className={styles.productImage}
                      />
                      <div className={styles.productDetails}>
                        <Link to={`/products/${item.product_id}`} className={styles.productName}>
                          {item.product.title}
                        </Link>
                        <span className={styles.productQuantity}>
                          {item.quantity} шт. × {item.unit_price.toLocaleString()} ₽
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemTotal}>
                      {(item.quantity * item.unit_price).toLocaleString()} ₽
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  <span>Итого:</span>
                  <span className={styles.totalAmount}>{order.total_price.toLocaleString()} ₽</span>
                </div>
                
                <Link to={`/orders/${order.id}`} className={styles.viewOrderButton}>
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noOrders}>
          <p>У вас пока нет заказов</p>
          <Link to="/products" className={styles.shopButton}>
            Перейти к покупкам
          </Link>
        </div>
      )}
    </div>
  );
}; 