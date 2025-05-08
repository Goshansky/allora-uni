import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { mockOrders, mockFavorites } from '../../data/mockData';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { user, updateUser, isLoading, isAuthenticated } = useAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  // Set form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading || !user) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }
  
  // Get user's favorites and orders from mock data
  const userFavorites = mockFavorites.filter(fav => fav.user_id === user.id);
  const userOrders = mockOrders.filter(order => order.user_id === user.id);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await updateUser({
        username: formData.username,
        email: formData.email
      });
      
      setSubmitStatus({
        message: 'Профиль успешно обновлен',
        type: 'success'
      });
      
      setEditMode(false);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        message: 'Не удалось обновить профиль',
        type: 'error'
      });
    }
  };
  
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
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мой профиль</h1>
      
      {submitStatus && (
        <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
          {submitStatus.message}
        </div>
      )}
      
      <div className={styles.contentGrid}>
        <div className={styles.profileSection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Личная информация</h2>
            
            {editMode ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label="Имя пользователя"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  disabled={isLoading}
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isLoading}
                />
                
                <div className={styles.buttonGroup}>
                  <Button 
                    type="submit" 
                    variant="primary"
                    isLoading={isLoading}
                  >
                    Сохранить
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        username: user.username,
                        email: user.email
                      });
                      setErrors({});
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Имя пользователя:</span>
                  <span className={styles.infoValue}>{user.username}</span>
                </div>
                
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Аккаунт создан:</span>
                  <span className={styles.infoValue}>{formatDate(user.created_at)}</span>
                </div>
                
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Статус:</span>
                  <span className={styles.infoValue}>
                    {user.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                </div>
                
                <Button 
                  onClick={() => setEditMode(true)}
                  variant="secondary"
                >
                  Редактировать
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.activitySection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Последние заказы</h2>
            
            {userOrders.length > 0 ? (
              <div className={styles.ordersList}>
                {userOrders.map(order => (
                  <div key={order.id} className={styles.orderItem}>
                    <div className={styles.orderHeader}>
                      <span className={styles.orderNumber}>Заказ #{order.id}</span>
                      <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                    </div>
                    
                    <div className={styles.orderDetails}>
                      <div className={styles.orderStatus}>
                        <span className={styles.orderStatusLabel}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </div>
                      
                      <div className={styles.orderItems}>
                        {order.items.map(item => (
                          <div key={item.id} className={styles.orderProduct}>
                            <span>{item.product.name}</span>
                            <span>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.orderTotal}>
                        <span>Сумма:</span>
                        <span className={styles.orderPrice}>{order.total.toLocaleString()} ₽</span>
                      </div>
                    </div>
                    
                    <Link to={`/orders/${order.id}`} className={styles.link}>
                      Подробнее
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                У вас пока нет заказов
              </div>
            )}
            
            <div className={styles.sectionFooter}>
              <Link to="/orders" className={styles.link}>
                Все заказы
              </Link>
            </div>
          </div>
          
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Избранные товары</h2>
            
            {userFavorites.length > 0 ? (
              <div className={styles.favoritesList}>
                {userFavorites.map(fav => (
                  <Link
                    key={fav.id}
                    to={`/products/${fav.product_id}`}
                    className={styles.favoriteItem}
                  >
                    <img
                      src={fav.product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'}
                      alt={fav.product.name}
                      className={styles.favoriteImage}
                    />
                    <div className={styles.favoriteInfo}>
                      <span className={styles.favoriteName}>{fav.product.name}</span>
                      <span className={styles.favoritePrice}>
                        {fav.product.price.toLocaleString()} ₽
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                У вас пока нет избранных товаров
              </div>
            )}
            
            <div className={styles.sectionFooter}>
              <Link to="/favorites" className={styles.link}>
                Все избранные
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 