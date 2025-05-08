import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import classNames from 'classnames';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cart?.items.reduce((count, item) => count + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          AlloraUni
        </Link>
        
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>
        
        <nav className={styles.nav}>
          <NavLink 
            to="/products" 
            className={({ isActive }) => classNames(
              styles.navLink,
              isActive && styles.active
            )}
          >
            Товары
          </NavLink>
          <NavLink 
            to="/categories" 
            className={({ isActive }) => classNames(
              styles.navLink,
              isActive && styles.active
            )}
          >
            Категории
          </NavLink>
          
          <div className={styles.userActions}>
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/cart" 
                  className={({ isActive }) => classNames(
                    styles.navLink,
                    styles.cartIcon,
                    isActive && styles.active
                  )}
                >
                  Корзина
                  {cartItemCount > 0 && (
                    <span className={styles.cartCount}>{cartItemCount}</span>
                  )}
                </NavLink>
                
                <div className={styles.userMenuContainer}>
                  <button 
                    className={styles.userButton}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user?.username}
                    <span className={styles.triangle}>▼</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className={styles.userMenu}>
                      <NavLink 
                        to="/profile" 
                        className={({ isActive }) => classNames(
                          styles.menuItem,
                          isActive && styles.active
                        )}
                        onClick={() => setShowUserMenu(false)}
                      >
                        Профиль
                      </NavLink>
                      <NavLink 
                        to="/favorites" 
                        className={({ isActive }) => classNames(
                          styles.menuItem,
                          isActive && styles.active
                        )}
                        onClick={() => setShowUserMenu(false)}
                      >
                        Избранное
                      </NavLink>
                      <NavLink 
                        to="/orders" 
                        className={({ isActive }) => classNames(
                          styles.menuItem,
                          isActive && styles.active
                        )}
                        onClick={() => setShowUserMenu(false)}
                      >
                        Заказы
                      </NavLink>
                      {user?.is_admin && (
                        <NavLink 
                          to="/admin/products" 
                          className={({ isActive }) => classNames(
                            styles.menuItem,
                            isActive && styles.active
                          )}
                          onClick={() => setShowUserMenu(false)}
                        >
                          Админ-панель
                        </NavLink>
                      )}
                      <button 
                        className={styles.menuItem} 
                        onClick={handleLogout}
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => classNames(
                    styles.navLink,
                    styles.loginButton,
                    isActive && styles.active
                  )}
                >
                  Войти
                </NavLink>
                <NavLink 
                  to="/register" 
                  className={({ isActive }) => classNames(
                    styles.navLink,
                    styles.registerButton,
                    isActive && styles.active
                  )}
                >
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}; 