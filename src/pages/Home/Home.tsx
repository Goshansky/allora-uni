import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

type Product = {
    id: number;
    title: string;
    image: string;
    price: number;
};

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then(setProducts)
            .catch((err) => console.error("Ошибка загрузки товаров", err));
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Каталог товаров</h1>
            <div className={styles.grid}>
                {products.map((product) => (
                    <Link to={`/products/${product.id}`} key={product.id} className={styles.card}>
                        <img src={product.image} alt={product.title} className={styles.image} />
                        <h2 className={styles.title}>{product.title}</h2>
                        <p className={styles.price}>{product.price} ₽</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;

