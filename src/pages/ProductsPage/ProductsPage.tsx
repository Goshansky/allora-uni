import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';
import { Input } from '../../components/common/Input.tsx';
import styles from './ProductsPage.module.css';
import classNames from 'classnames';

import { mockProducts, mockCategories, mockFavorites } from '../../data/mockData.ts';
import type { Product } from '../../types/models.ts';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Получаем параметры из URL
  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
  const sortBy = searchParams.get('sort') || 'name';
  const currentPage = Number(searchParams.get('page') || '1');
  const pageSize = 8;

  // Функция для обновления параметров URL
  const updateSearchParams = (
    params: { search?: string; category?: number; sort?: string; page?: number }
  ) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });
    
    // Сбрасываем страницу на первую при изменении фильтров
    if (params.search !== undefined || params.category !== undefined || params.sort !== undefined) {
      newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  };

  // Эффект для фильтрации и сортировки продуктов
  useEffect(() => {
    setIsLoading(true);
    
    // Фильтрация по поисковому запросу и категории
    let results = [...mockProducts];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
      );
    }
    
    if (categoryId) {
      results = results.filter(product => product.category_id === categoryId);
    }
    
    // Сортировка
    switch (sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // 'name'
        results.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProducts(results);
    setIsLoading(false);
  }, [searchQuery, categoryId, sortBy]);
  
  // Вычисляем пагинацию
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Обработчики событий
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ search: e.target.value || undefined });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateSearchParams({ category: value ? Number(value) : undefined });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ sort: e.target.value });
  };
  
  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };
  
  const handleToggleFavorite = (productId: number) => {
    // В реальном приложении здесь был бы запрос к API
    console.log('Toggle favorite for product:', productId);
  };

  // Создаем массив кнопок пагинации
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        className={classNames(styles.pageButton, {
          [styles.activePage]: i === currentPage,
        })}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Все товары</h1>
        
        <div className={styles.filters}>
          <div className={styles.search}>
            <Input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="category">Категория:</label>
            <select
              id="category"
              className={styles.categorySelect}
              value={categoryId || ''}
              onChange={handleCategoryChange}
            >
              <option value="">Все категории</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="sort">Сортировка:</label>
            <select
              id="sort"
              className={styles.sortSelect}
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="name">По названию</option>
              <option value="price_asc">По цене (сначала дешевые)</option>
              <option value="price_desc">По цене (сначала дорогие)</option>
              <option value="newest">По новизне</option>
            </select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div>Загрузка товаров...</div>
      ) : (
        <>
          <ProductGrid
            products={paginatedProducts}
            favorites={mockFavorites}
            onToggleFavorite={handleToggleFavorite}
          />
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {paginationButtons}
            </div>
          )}
        </>
      )}
    </div>
  );
}; 