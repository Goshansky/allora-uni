import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>AlloraUni</Link>
            <nav className={styles.nav}>
                <Link to="/">Главная</Link>
                <Link to="/cart">Корзина</Link>
                <Link to="/login">Вход</Link>
            </nav>
        </header>
    );
};

export default Header;
