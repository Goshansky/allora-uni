import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockOrders } from '../../data/mockData';
import styles from './OrdersPage.module.css';

export const OrdersPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading || !user) {
    return <div className={styles.loading}>Загрузка заказов...</div>;
  }
  
  // Get user's orders from mock data
  const userOrders = mockOrders.filter(order => order.user_id === user.id);
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  // Convert order status to readable string
  const getOrderStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'В обработке',
      'processing': 'Обрабатывается',
      'shipping': 'Доставляется',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    
    return statusMap[status] || status;
  };
  
  // Get status class for styling
  const getStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      'pending': styles.statusPending,
      'processing': styles.statusProcessing,
      'shipping': styles.statusShipping,
      'delivered': styles.statusDelivered,
      'cancelled': styles.statusCancelled
    };
    
    return statusClassMap[status] || '';
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои заказы</h1>
      
      {userOrders.length > 0 ? (
        <div className={styles.ordersList}>
          {userOrders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderNumber}>Заказ #{order.id}</span>
                  <span className={styles.orderDate}>от {formatDate(order.created_at)}</span>
                </div>
                
                <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </div>
              </div>
              
              <div className={styles.orderItems}>
                {order.items.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <Link to={`/products/${item.product_id}`} className={styles.itemImage}>
                      <img 
                        src={item.product.image_url || 'https://via.placeholder.com/80x80?text=No+Image'} 
                        alt={item.product.name} 
                      />
                    </Link>
                    
                    <div className={styles.itemDetails}>
                      <Link to={`/products/${item.product_id}`} className={styles.itemName}>
                        {item.product.name}
                      </Link>
                      <div className={styles.itemPrice}>
                        {item.price.toLocaleString()} ₽ × {item.quantity} шт.
                      </div>
                    </div>
                    
                    <div className={styles.itemTotal}>
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  <span>Итого:</span>
                  <span className={styles.totalPrice}>{order.total.toLocaleString()} ₽</span>
                </div>
                
                <Link to={`/orders/${order.id}`} className={styles.detailsButton}>
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>У вас пока нет заказов</h2>
          <p className={styles.emptyDescription}>
            После оформления заказа вы сможете отслеживать его статус здесь.
          </p>
          <Link to="/products" className={styles.shopButton}>
            Перейти к покупкам
          </Link>
        </div>
      )}
    </div>
  );
}; 