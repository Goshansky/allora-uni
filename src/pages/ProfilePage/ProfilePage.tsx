import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { cartService } from '../../services/cartService';
import { productService } from '../../services/productService';
import type { Order, FavoriteWithProduct, UserUpdate } from '../../types/models';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { user, updateUser, isLoading, isAuthenticated } = useAuth();
  
  // Состояния для редактирования профиля
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  // Состояния для данных пользователя
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategories: [] as { name: string; count: number }[]
  });
  
  // Устанавливаем данные формы, когда данные пользователя загружены
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);
  
  // Загружаем заказы и избранное пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsDataLoading(true);
      setDataError(null);
      
      try {
        // Загружаем заказы пользователя
        const ordersData = await cartService.getOrders();
        setOrders(ordersData);
        
        // Загружаем избранное пользователя
        const favoritesData = await productService.getFavorites();
        setFavorites(favoritesData.favorites);
        
        // Вычисляем статистику пользователя
        const totalOrders = ordersData.length;
        const totalSpent = ordersData.reduce((sum, order) => sum + order.total_price, 0);
        
        // Определяем любимые категории пользователя
        const categoryCount: Record<string, number> = {};
        favoritesData.favorites.forEach(fav => {
          const categoryName = fav.product.category_id; // В идеале здесь должно быть имя категории
          categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
        });
        
        const favoriteCategories = Object.entries(categoryCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        
        setUserStats({
          totalOrders,
          totalSpent,
          favoriteCategories
        });
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
        setDataError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Если не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading || !user) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку поля при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку поля при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем валидность формы
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      
      // Скрываем сообщение через 3 секунды
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      
      setSubmitStatus({
        message: 'Не удалось обновить профиль',
        type: 'error'
      });
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем валидность формы
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Введите текущий пароль';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Пароль должен содержать минимум 8 символов';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите новый пароль';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const userData: UserUpdate = {
        password: passwordData.newPassword
      };
      await updateUser(userData);
      
      setSubmitStatus({
        message: 'Пароль успешно изменен',
        type: 'success'
      });
      
      // Очищаем форму
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Скрываем сообщение через 3 секунды
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      
      setSubmitStatus({
        message: 'Не удалось изменить пароль',
        type: 'error'
      });
    }
  };
  
  // Форматирование даты в читаемый вид
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Личный кабинет</h1>
      
      <div className={styles.dashboard}>
        <div className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userName}>{user.username}</div>
            <div className={styles.userEmail}>{user.email}</div>
            <div className={styles.userSince}>На сайте с {formatDate(user.created_at)}</div>
          </div>
          
          <div className={styles.statsCard}>
            <h3 className={styles.statsTitle}>Ваша статистика</h3>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Заказов:</span>
              <span className={styles.statValue}>{userStats.totalOrders}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Потрачено:</span>
              <span className={styles.statValue}>{userStats.totalSpent.toLocaleString()} ₽</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>В избранном:</span>
              <span className={styles.statValue}>{favorites.length}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Мои данные</h2>
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Профиль
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'password' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  Пароль
                </button>
              </div>
            </div>
            
            {submitStatus && (
              <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
                {submitStatus.message}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <>
                {editMode ? (
                  <form className={styles.profileForm} onSubmit={handleProfileSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="username">Имя пользователя</label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleProfileChange}
                        error={errors.username}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        error={errors.email}
                      />
                    </div>
                    
                    <div className={styles.formActions}>
                      <Button type="submit" variant="primary">
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
                      <span className={styles.infoLabel}>Дата регистрации:</span>
                      <span className={styles.infoValue}>{formatDate(user.created_at)}</span>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      onClick={() => setEditMode(true)}
                      className={styles.editButton}
                    >
                      Редактировать
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'password' && (
              <form className={styles.passwordForm} onSubmit={handlePasswordSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Текущий пароль</label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={errors.currentPassword}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Новый пароль</label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={errors.newPassword}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={errors.confirmPassword}
                  />
                </div>
                
                <div className={styles.formActions}>
                  <Button type="submit" variant="primary">
                    Изменить пароль
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          <div className={styles.ordersSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Последние заказы</h2>
              {orders.length > 0 && (
                <Link to="/orders" className={styles.viewAllLink}>
                  Все заказы
                </Link>
              )}
            </div>
            
            {isDataLoading ? (
              <div className={styles.loading}>Загрузка заказов...</div>
            ) : dataError ? (
              <div className={styles.error}>{dataError}</div>
            ) : orders.length > 0 ? (
              <div className={styles.ordersList}>
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <span className={styles.orderNumber}>Заказ #{order.id.substring(0, 8)}</span>
                      <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                    </div>
                    <div className={styles.orderStatus}>
                      <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                        {order.status === 'pending' && 'В обработке'}
                        {order.status === 'paid' && 'Оплачен'}
                        {order.status === 'shipped' && 'Отправлен'}
                        {order.status === 'completed' && 'Доставлен'}
                        {order.status === 'cancelled' && 'Отменен'}
                      </span>
                    </div>
                    <div className={styles.orderAmount}>
                      {order.total_price.toLocaleString()} ₽
                    </div>
                    <Link to={`/orders/${order.id}`} className={styles.orderLink}>
                      Подробнее
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>
                <p>У вас пока нет заказов</p>
                <Link to="/products" className={styles.shopLink}>
                  Перейти к покупкам
                </Link>
              </div>
            )}
          </div>
          
          <div className={styles.favoritesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Избранные товары</h2>
              {favorites.length > 0 && (
                <Link to="/favorites" className={styles.viewAllLink}>
                  Все избранные
                </Link>
              )}
            </div>
            
            {isDataLoading ? (
              <div className={styles.loading}>Загрузка избранного...</div>
            ) : dataError ? (
              <div className={styles.error}>{dataError}</div>
            ) : favorites.length > 0 ? (
              <div className={styles.favoritesList}>
                {favorites.slice(0, 4).map(favorite => (
                  <Link 
                    key={favorite.id} 
                    to={`/products/${favorite.product_id}`}
                    className={styles.favoriteCard}
                  >
                    <img 
                      src={favorite.product.image_url || 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={favorite.product.title} 
                      className={styles.favoriteImage}
                    />
                    <div className={styles.favoriteInfo}>
                      <h3 className={styles.favoriteName}>{favorite.product.title}</h3>
                      <span className={styles.favoritePrice}>
                        {favorite.product.price.toLocaleString()} ₽
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>
                <p>У вас пока нет избранных товаров</p>
                <Link to="/products" className={styles.shopLink}>
                  Перейти к каталогу
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 