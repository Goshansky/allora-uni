import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/common/Button';
import { mockProducts } from '../../../data/mockData';
import styles from './AdminProductsPage.module.css';

export const AdminProductsPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
  
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedProducts.length === mockProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(mockProducts.map(product => product.id));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return;
    
    setIsDeleting(true);
    
    // Simulate API call to delete products
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application, we would call an API to delete products
    console.log(`Deleting products with IDs: ${selectedProducts.join(', ')}`);
    
    setSelectedProducts([]);
    setIsDeleting(false);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Управление товарами</h1>
        
        <div className={styles.actions}>
          <Button 
            variant="secondary" 
            onClick={handleSelectAll}
          >
            {selectedProducts.length === mockProducts.length ? 'Снять выделение' : 'Выбрать все'}
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => {}}
          >
            Добавить товар
          </Button>
        </div>
      </div>
      
      {selectedProducts.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>
            Выбрано товаров: {selectedProducts.length}
          </span>
          
          <Button 
            variant="danger" 
            onClick={handleDeleteSelected}
            isLoading={isDeleting}
          >
            Удалить выбранные
          </Button>
        </div>
      )}
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxCell}></th>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Наличие</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map(product => (
              <tr key={product.id} className={selectedProducts.includes(product.id) ? styles.selectedRow : ''}>
                <td className={styles.checkboxCell}>
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td>{product.id}</td>
                <td className={styles.imageCell}>
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'} 
                    alt={product.name} 
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category?.name || 'Без категории'}</td>
                <td>{product.price.toLocaleString()} ₽</td>
                <td>
                  <span className={product.in_stock ? styles.inStock : styles.outOfStock}>
                    {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionButton} title="Редактировать">
                    ✏️
                  </button>
                  <button className={styles.actionButton} title="Удалить">
                    🗑️
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