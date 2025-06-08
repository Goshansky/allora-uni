import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/common/Button';
import { productService } from '../../../services/productService';
import type { CategoryWithProductsCount } from '../../../types/models';
import styles from './AdminCategoriesPage.module.css';

export const AdminCategoriesPage = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [categories, setCategories] = useState<CategoryWithProductsCount[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Если не авторизован или не админ, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setError('Не удалось загрузить категории. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [user]);
  
  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Загрузка...</div>;
  }
  
  if (!user.is_admin) {
    return <Navigate to="/" />;
  }
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка категорий...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(category => category.id));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedCategories.length === 0) return;
    
    setIsDeleting(true);
    
    try {
      // Удаляем выбранные категории последовательно
      for (const categoryId of selectedCategories) {
        await productService.deleteCategory(categoryId);
      }
      
      // Обновляем список категорий после удаления
      const updatedCategories = await productService.getCategories();
      setCategories(updatedCategories);
      setSelectedCategories([]);
    } catch (err) {
      console.error('Ошибка при удалении категорий:', err);
      setError('Не удалось удалить выбранные категории.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleCreateCategory = () => {
    // Перенаправление на страницу создания категории
    window.location.href = '/admin/categories/create';
  };
  
  const handleEditCategory = (categoryId: string) => {
    // Перенаправление на страницу редактирования категории
    window.location.href = `/admin/categories/edit/${categoryId}`;
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Управление категориями</h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.actions}>
        <Button 
          variant="primary" 
          onClick={handleCreateCategory}
        >
          Создать категорию
        </Button>
        
        <Button 
          variant="danger" 
          onClick={handleDeleteSelected}
          disabled={selectedCategories.length === 0 || isDeleting}
          isLoading={isDeleting}
        >
          Удалить выбранные
        </Button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedCategories.length === categories.length && categories.length > 0}
                  onChange={handleSelectAll}
                  disabled={categories.length === 0}
                />
              </th>
              <th>ID</th>
              <th>Название</th>
              <th>Родительская категория</th>
              <th>Кол-во товаров</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => {
              const parentCategory = categories.find(c => c.id === category.parent_id);
              
              return (
                <tr key={category.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleSelectCategory(category.id)}
                    />
                  </td>
                  <td>{category.id.substring(0, 8)}</td>
                  <td>{category.name}</td>
                  <td>{parentCategory ? parentCategory.name : '-'}</td>
                  <td>{category.products_count}</td>
                  <td>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditCategory(category.id)}
                    >
                      Редактировать
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyMessage}>
                  Нет доступных категорий
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 