import { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cartService } from '../../services/cartService';
import { Button } from '../../components/common/Button';
import type { Order } from '../../types/models';
import styles from './OrderDetailPage.module.css';

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const orderData = await cartService.getOrderById(id);
        setOrder(orderData);
      } catch (err) {
        console.error('Ошибка при загрузке заказа:', err);
        setError('Не удалось загрузить информацию о заказе. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  // Если не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAuthLoading) {
    return <div className={styles.loading}>Проверка авторизации...</div>;
  }
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка информации о заказе...</div>;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <Button variant="secondary" onClick={() => navigate('/orders')}>
          Вернуться к списку заказов
        </Button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>Заказ не найден</div>
        <Button variant="secondary" onClick={() => navigate('/orders')}>
          Вернуться к списку заказов
        </Button>
      </div>
    );
  }
  
  // Форматирование даты в читаемый вид
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className={styles.header}>
        <Button 
          variant="secondary" 
          className={styles.backButton}
          onClick={() => navigate('/orders')}
        >
          ← Назад к заказам
        </Button>
        <h1 className={styles.title}>Заказ #{order.id.substring(0, 8)}</h1>
      </div>
      
      <div className={styles.orderContent}>
        <div className={styles.orderInfo}>
          <div className={styles.orderCard}>
            <h2 className={styles.cardTitle}>Информация о заказе</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Номер заказа:</span>
                <span className={styles.infoValue}>{order.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Дата заказа:</span>
                <span className={styles.infoValue}>{formatDate(order.created_at)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Статус:</span>
                <span className={`${styles.infoValue} ${styles.statusValue} ${getStatusClass(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Сумма заказа:</span>
                <span className={styles.infoValue}>{order.total_price.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
          
          {/* Здесь могла бы быть информация о доставке и оплате */}
          <div className={styles.orderCard}>
            <h2 className={styles.cardTitle}>Адрес доставки</h2>
            <div className={styles.addressInfo}>
              <p className={styles.addressText}>
                Иванов Иван Иванович<br />
                г. Москва, ул. Примерная, д. 123, кв. 45<br />
                123456<br />
                +7 (900) 123-45-67
              </p>
            </div>
          </div>
          
          <div className={styles.orderCard}>
            <h2 className={styles.cardTitle}>Способ оплаты</h2>
            <div className={styles.paymentInfo}>
              <p className={styles.paymentText}>
                Оплата картой при получении
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.orderItems}>
          <div className={styles.orderCard}>
            <h2 className={styles.cardTitle}>Товары в заказе</h2>
            
            <div className={styles.itemsList}>
              {order.items && order.items.map(item => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.productInfo}>
                    <img 
                      src={item.product.image_url || 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={item.product.title}
                      className={styles.productImage}
                    />
                    <div className={styles.productDetails}>
                      <Link to={`/products/${item.product_id}`} className={styles.productName}>
                        {item.product.title}
                      </Link>
                      <div className={styles.productMeta}>
                        <span className={styles.productPrice}>
                          {item.unit_price.toLocaleString()} ₽ за шт.
                        </span>
                        <span className={styles.productQuantity}>
                          Количество: {item.quantity} шт.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {(item.quantity * item.unit_price).toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Товары ({order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} шт.):</span>
                <span>{order.total_price.toLocaleString()} ₽</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Доставка:</span>
                <span>0 ₽</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Итого:</span>
                <span>{order.total_price.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.actions}>
        {order.status === 'pending' && (
          <Button variant="secondary" className={styles.cancelButton}>
            Отменить заказ
          </Button>
        )}
        <Button variant="primary" className={styles.supportButton}>
          Связаться с поддержкой
        </Button>
      </div>
    </div>
  );
}; 