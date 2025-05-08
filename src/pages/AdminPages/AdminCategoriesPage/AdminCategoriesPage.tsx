import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/common/Button';
import { mockCategories } from '../../../data/mockData';
import styles from './AdminCategoriesPage.module.css';

export const AdminCategoriesPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
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
  
  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedCategories.length === mockCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(mockCategories.map(category => category.id));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedCategories.length === 0) return;
    
    setIsDeleting(true);
    
    // Simulate API call to delete categories
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application, we would call an API to delete categories
    console.log(`Deleting categories with IDs: ${selectedCategories.join(', ')}`);
    
    setSelectedCategories([]);
    setIsDeleting(false);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Управление категориями</h1>
        
        <div className={styles.actions}>
          <Button 
            variant="secondary" 
            onClick={handleSelectAll}
          >
            {selectedCategories.length === mockCategories.length ? 'Снять выделение' : 'Выбрать все'}
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => {}}
          >
            Добавить категорию
          </Button>
        </div>
      </div>
      
      {selectedCategories.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>
            Выбрано категорий: {selectedCategories.length}
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
              <th>Название</th>
              <th>Описание</th>
              <th>Кол-во товаров</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {mockCategories.map(category => (
              <tr key={category.id} className={selectedCategories.includes(category.id) ? styles.selectedRow : ''}>
                <td className={styles.checkboxCell}>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectCategory(category.id)}
                  />
                </td>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td className={styles.descriptionCell}>
                  {category.description || 'Нет описания'}
                </td>
                <td>
                  {/* In a real app, we would count products in this category */}
                  {Math.floor(Math.random() * 20)}
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