import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../../components/products/ProductGrid.tsx';
import { Input } from '../../components/common/Input.tsx';
import { productService } from '../../services/productService.ts';
import styles from './ProductsPage.module.css';
import classNames from 'classnames';

import type { Product, CategoryWithProductsCount, FavoriteWithProduct } from '../../types/models.ts';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithProductsCount[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Получаем параметры из URL
  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || undefined;
  const sortBy = searchParams.get('sort') || 'title';
  const currentPage = Number(searchParams.get('page') || '1');
  const pageSize = 8;

  // Функция для обновления параметров URL
  const updateSearchParams = (
    params: { search?: string; category?: string; sort?: string; page?: number }
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

  // Загрузка данных при изменении параметров
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Загружаем категории
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
        
        // Загружаем товары с учетом фильтров
        let productsData: Product[] = [];
        
        if (categoryId) {
          // Если выбрана категория, загружаем товары этой категории
          productsData = await productService.getProductsByCategory(
            categoryId,
            (currentPage - 1) * pageSize,
            pageSize
          );
          
          // Также проверяем, есть ли у этой категории подкатегории
          const subcategories = categoriesData.filter(cat => cat.parent_id === categoryId);
          
          // Если есть подкатегории, загружаем товары из них тоже
          if (subcategories.length > 0) {
            const subcategoryProductsPromises = subcategories.map(subcat => 
              productService.getProductsByCategory(subcat.id)
            );
            
            const subcategoryProductsArrays = await Promise.all(subcategoryProductsPromises);
            const subcategoryProducts = subcategoryProductsArrays.flat();
            
            // Объединяем товары текущей категории и всех подкатегорий
            productsData = [...productsData, ...subcategoryProducts];
          }
          
          // Получаем общее количество товаров для пагинации
          const selectedCategory = categoriesData.find(cat => cat.id === categoryId);
          if (selectedCategory) {
            // Если это основная категория, учитываем товары в подкатегориях
            if (!selectedCategory.parent_id) {
              const subcats = categoriesData.filter(cat => cat.parent_id === categoryId);
              const totalProductsCount = selectedCategory.products_count + 
                subcats.reduce((sum, subcat) => sum + subcat.products_count, 0);
              setTotalCount(totalProductsCount);
            } else {
              // Если это подкатегория, берем только её товары
              setTotalCount(selectedCategory.products_count);
            }
          }
        } else {
          // Иначе загружаем все товары
          productsData = await productService.getProducts(
            (currentPage - 1) * pageSize,
            pageSize
          );
          
          // Получаем общее количество товаров для пагинации
          // Суммируем количество товаров во всех категориях
          const totalProductsCount = categoriesData.reduce(
            (sum, category) => sum + category.products_count, 
            0
          );
          setTotalCount(totalProductsCount);
        }
        
        // Сохраняем все загруженные товары
        setAllProducts(productsData);
        
        // Если есть поисковый запрос, фильтруем товары локально
        if (searchQuery) {
          productsData = productsData.filter(product => 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Сортировка товаров
        productsData.sort((a, b) => {
          if (sortBy === 'price_asc') {
            return a.price - b.price;
          } else if (sortBy === 'price_desc') {
            return b.price - a.price;
          } else if (sortBy === 'newest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          } else {
            // По умолчанию сортируем по названию
            return a.title.localeCompare(b.title);
          }
        });
        
        // Применяем пагинацию к отфильтрованным и отсортированным товарам
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedProducts = productsData.slice(startIndex, startIndex + pageSize);
        
        setProducts(paginatedProducts);
        
        // Загружаем избранное пользователя
        try {
          const favoritesData = await productService.getFavorites();
          setFavorites(favoritesData.favorites);
        } catch (favError) {
          console.error('Ошибка при загрузке избранного:', favError);
          // Не показываем ошибку пользователю, так как это не критично
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery, categoryId, sortBy, currentPage]);

  // Обработчик переключения избранного
  const handleToggleFavorite = async (productId: string) => {
    try {
      const isFavorite = favorites.some(f => f.product_id === productId);
      
      if (isFavorite) {
        await productService.removeFromFavorites(productId);
        setFavorites(prev => prev.filter(f => f.product_id !== productId));
      } else {
        const newFavorite = await productService.addToFavorites(productId);
        setFavorites(prev => [...prev, newFavorite]);
      }
    } catch (error) {
      console.error('Ошибка при обновлении избранного:', error);
    }
  };
  
  // Обработчики фильтрации и сортировки
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    updateSearchParams({ search: searchValue || undefined });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ category: e.target.value || undefined });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ sort: e.target.value });
  };
  
  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };
  
  // Группируем категории по родительским категориям для улучшенного отображения
  const groupedCategories = categories.reduce((acc, category) => {
    if (!category.parent_id) {
      // Это основная категория
      acc.push({
        ...category,
        isParent: true
      });
    } else {
      // Это подкатегория, добавляем с отступом
      acc.push({
        ...category,
        isParent: false
      });
    }
    return acc;
  }, [] as (CategoryWithProductsCount & { isParent: boolean })[]);
  
  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Функция для создания пагинации с многоточием
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Всегда показываем первую страницу
    items.push(1);
    
    if (totalPages <= maxVisiblePages) {
      // Если страниц мало, показываем все
      for (let i = 2; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Иначе показываем текущую страницу и соседние
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      
      if (leftBound > 2) {
        items.push('...');
      }
      
      for (let i = leftBound; i <= rightBound; i++) {
        items.push(i);
      }
      
      if (rightBound < totalPages - 1) {
        items.push('...');
      }
      
      // Всегда показываем последнюю страницу
      if (totalPages > 1) {
        items.push(totalPages);
      }
    }
    
    return items;
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Каталог товаров</h1>
      
      <div className={styles.filters}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <Input 
            type="text" 
            name="search" 
            placeholder="Поиск товаров..." 
            defaultValue={searchQuery}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Найти
          </button>
        </form>
        
        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="category" className={styles.filterLabel}>Категория:</label>
            <select 
              id="category" 
              className={styles.filterSelect}
              value={categoryId || ''}
              onChange={handleCategoryChange}
            >
              <option value="">Все категории</option>
              {groupedCategories.map(category => (
                <option 
                  key={category.id} 
                  value={category.id}
                  className={category.isParent ? styles.parentCategory : styles.childCategory}
                >
                  {!category.isParent && '— '}{category.name} ({category.products_count})
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="sort" className={styles.filterLabel}>Сортировка:</label>
            <select 
              id="sort" 
              className={styles.filterSelect}
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="title">По названию</option>
              <option value="newest">Сначала новые</option>
              <option value="price_asc">По цене (возрастание)</option>
              <option value="price_desc">По цене (убывание)</option>
            </select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loading}>Загрузка товаров...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : products.length > 0 ? (
        <>
          <div className={styles.resultsInfo}>
            Найдено товаров: <strong>{totalCount}</strong>
            {currentPage > 1 && totalCount > pageSize && (
              <span> (показаны {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)})</span>
            )}
          </div>
          
          <ProductGrid 
            products={products} 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {/* Кнопка "Назад" */}
              <button 
                className={classNames(styles.pageButton, styles.navButton)}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Предыдущая страница"
              >
                &laquo;
              </button>
              
              {/* Номера страниц */}
              {getPaginationItems().map((item, index) => (
                typeof item === 'number' ? (
                  <button 
                    key={index}
                    className={classNames(
                      styles.pageButton,
                      { [styles.activePage]: item === currentPage }
                    )}
                    onClick={() => handlePageChange(item)}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={index} className={styles.ellipsis}>...</span>
                )
              ))}
              
              {/* Кнопка "Вперед" */}
              <button 
                className={classNames(styles.pageButton, styles.navButton)}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Следующая страница"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.noProducts}>
          <p>По вашему запросу ничего не найдено</p>
          {(searchQuery || categoryId) && (
            <button 
              className={styles.resetButton}
              onClick={() => updateSearchParams({ search: undefined, category: undefined })}
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
}; 