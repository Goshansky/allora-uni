import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>Shop</h3>
            <ul className={styles.links}>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/products?sort=new">New Arrivals</Link></li>
              <li><Link to="/products?sort=popular">Popular</Link></li>
              <li><Link to="/products?sort=discounted">Discounts</Link></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h3>Customer Service</h3>
            <ul className={styles.links}>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping & Delivery</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h3>Account</h3>
            <ul className={styles.links}>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/favorites">Wishlist</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h3>About AlloraUni</h3>
            <ul className={styles.links}>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>&copy; {currentYear} AlloraUni. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">PT</a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 