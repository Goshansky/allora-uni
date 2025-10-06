import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/common/Button';
import { productService } from '../../../services/productService';
import type { Product } from '../../../types/models';
import styles from './AdminProductsPage.module.css';

export const AdminProductsPage = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Если не авторизован или не админ, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const productsData = await productService.getProducts();
        setProducts(productsData);
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        setError('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [user]);
  
  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Загрузка...</div>;
  }
  
  if (!user.is_admin) {
    return <Navigate to="/" />;
  }
  
  if (isLoading) {
    return <div className={styles.loading}>Загрузка товаров...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return;
    
    setIsDeleting(true);
    
    try {
      // Удаляем выбранные товары последовательно
      for (const productId of selectedProducts) {
        await productService.deleteProduct(productId);
      }
      
      // Обновляем список товаров после удаления
      const updatedProducts = await productService.getProducts();
      setProducts(updatedProducts);
      setSelectedProducts([]);
    } catch (err) {
      console.error('Ошибка при удалении товаров:', err);
      setError('Не удалось удалить выбранные товары.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleCreateProduct = () => {
    // Перенаправление на страницу создания товара
    window.location.href = '/admin/products/create';
  };
  
  const handleEditProduct = (productId: string) => {
    // Перенаправление на страницу редактирования товара
    window.location.href = `/admin/products/edit/${productId}`;
  };
  
  // Форматирование даты в читаемый вид
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Управление товарами</h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.actions}>
        <Button 
          variant="primary" 
          onClick={handleCreateProduct}
        >
          Создать товар
        </Button>
        
        <Button 
          variant="danger" 
          onClick={handleDeleteSelected}
          disabled={selectedProducts.length === 0 || isDeleting}
          isLoading={isDeleting}
        >
          Удалить выбранные
        </Button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={`${styles.table} admin-table`}>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={handleSelectAll}
                  disabled={products.length === 0}
                />
              </th>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Наличие</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td>{product.id.substring(0, 8)}</td>
                <td>
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'} 
                    alt={product.title}
                    className="admin-product-image"
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.price.toLocaleString()} ₽</td>
                <td>{product.stock}</td>
                <td>{formatDate(product.created_at)}</td>
                <td>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditProduct(product.id)}
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))}
            
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyMessage}>
                  Нет доступных товаров
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 