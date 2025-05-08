import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Страница не найдена</h2>
        <p className={styles.description}>
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <Link to="/" className={styles.button}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}; 