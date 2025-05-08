import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProductPage.module.css";

type Product = {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
};

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then(setProduct)
            .catch((err) => console.error("Ошибка загрузки товара", err));
    }, [id]);

    if (!product) return <p>Загрузка...</p>;

    return (
        <div className={styles.container}>
            <img src={product.image} alt={product.title} className={styles.image} />
            <div className={styles.details}>
                <h1 className={styles.title}>{product.title}</h1>
                <p className={styles.description}>{product.description}</p>
                <p className={styles.price}>{product.price} ₽</p>
                <button className={styles.addToCart}>Добавить в корзину</button>
            </div>
        </div>
    );
};

export default ProductPage;

