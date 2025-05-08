import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/common/Button';
import { mockOrders } from '../../../data/mockData';
import styles from './AdminOrdersPage.module.css';

export const AdminOrdersPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading || !user) {
    return <div className={styles.loading}>Загрузка...</div>;
  }
  
  if (!user.is_admin) {
    return <Navigate to="/" />;
  }
  
  const handleSelectOrder = (orderId: number) => {
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
  
  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === statusFilter);
  
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
            <option value="processing">Обрабатывается</option>
            <option value="shipping">Доставляется</option>
            <option value="delivered">Доставлен</option>
            <option value="cancelled">Отменен</option>
          </select>
          
          <Button 
            variant="secondary" 
            onClick={handleSelectAll}
          >
            {selectedOrders.length === filteredOrders.length ? 'Снять выделение' : 'Выбрать все'}
          </Button>
        </div>
      </div>
      
      {selectedOrders.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>
            Выбрано заказов: {selectedOrders.length}
          </span>
          
          <div className={styles.bulkButtons}>
            <Button 
              variant="secondary" 
              onClick={() => {}}
            >
              Изменить статус
            </Button>
            
            <Button 
              variant="danger" 
              onClick={() => {}}
            >
              Отменить заказы
            </Button>
          </div>
        </div>
      )}
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxCell}></th>
              <th>ID</th>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className={selectedOrders.includes(order.id) ? styles.selectedRow : ''}>
                <td className={styles.checkboxCell}>
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                </td>
                <td>#{order.id}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{order.user_id}</td>
                <td className={styles.totalCell}>{order.total.toLocaleString()} ₽</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionButton} title="Просмотреть детали">
                    👁️
                  </button>
                  <button className={styles.actionButton} title="Изменить статус">
                    📝
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={styles.pagination}>
        <button className={styles.pageButton} disabled>Назад</button>
        <span className={styles.pageInfo}>
          Страница 1 из 1
        </span>
        <button className={styles.pageButton} disabled>Вперед</button>
      </div>
    </div>
  );
}; 