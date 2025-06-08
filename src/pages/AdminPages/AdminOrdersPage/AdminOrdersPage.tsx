import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/common/Button';
import { apiService } from '../../../services/api';
import type { Order, OrderStatus } from '../../../types/models';
import styles from './AdminOrdersPage.module.css';

export const AdminOrdersPage = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Если не авторизован или не админ, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const ordersData = await apiService.get<Order[]>('/orders');
        setOrders(ordersData);
      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
        setError('Не удалось загрузить заказы. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Загрузка данных пользователя...</div>;
  }
  
  if (!user.is_admin) {
    return <Navigate to="/" />;
  }
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка заказов...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiService.put(`/orders/${orderId}`, { status: newStatus });
      
      // Обновляем список заказов после изменения статуса
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Ошибка при обновлении статуса заказа:', err);
      setError('Не удалось обновить статус заказа.');
    }
  };
  
  const handleBulkUpdateStatus = async (newStatus: OrderStatus) => {
    try {
      // Обновляем статус для каждого выбранного заказа
      for (const orderId of selectedOrders) {
        await apiService.put(`/orders/${orderId}`, { status: newStatus });
      }
      
      // Обновляем список заказов после изменения статусов
      const updatedOrders = orders.map(order => 
        selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setSelectedOrders([]);
    } catch (err) {
      console.error('Ошибка при массовом обновлении статусов заказов:', err);
      setError('Не удалось обновить статусы заказов.');
    }
  };
  
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
  
  // Фильтрация заказов по статусу
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Управление заказами</h1>
        
        <div className={styles.filters}>
          <select 
            className={styles.statusFilter} 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все заказы</option>
            <option value="pending">В обработке</option>
            <option value="paid">Оплачен</option>
            <option value="shipped">Отправлен</option>
            <option value="completed">Доставлен</option>
            <option value="cancelled">Отменен</option>
          </select>
          
          <Button 
            variant="secondary" 
            onClick={handleSelectAll}
            disabled={filteredOrders.length === 0}
          >
            {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0
              ? 'Снять выделение' 
              : 'Выбрать все'
            }
          </Button>
        </div>
      </div>
      
      {selectedOrders.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>
            Выбрано заказов: {selectedOrders.length}
          </span>
          
          <div className={styles.bulkButtons}>
            <select 
              className={styles.statusSelect}
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkUpdateStatus(e.target.value as OrderStatus);
                }
              }}
              value=""
            >
              <option value="" disabled>Изменить статус</option>
              <option value="pending">В обработке</option>
              <option value="paid">Оплачен</option>
              <option value="shipped">Отправлен</option>
              <option value="completed">Доставлен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
        </div>
      )}
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={handleSelectAll}
                  disabled={filteredOrders.length === 0}
                />
              </th>
              <th>ID</th>
              <th>Дата</th>
              <th>Пользователь</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id} className={selectedOrders.includes(order.id) ? styles.selectedRow : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </td>
                  <td>#{order.id.substring(0, 8)}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.user_id.substring(0, 8)}</td>
                  <td className={styles.totalCell}>{order.total_price.toLocaleString()} ₽</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <select 
                      className={styles.statusSelect}
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    >
                      <option value="pending">В обработке</option>
                      <option value="paid">Оплачен</option>
                      <option value="shipped">Отправлен</option>
                      <option value="completed">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyMessage}>
                  {statusFilter === 'all' 
                    ? 'Нет доступных заказов' 
                    : `Нет заказов со статусом "${getOrderStatusLabel(statusFilter)}"`
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 