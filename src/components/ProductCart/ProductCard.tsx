import type {Product} from '../../types/product.ts';
import { Link } from "react-router-dom";

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    return (
        <Link to={`/products/${product.id}`} className="border p-4 rounded shadow">
            <img src={product.image_url || "/placeholder.jpg"} alt={product.name} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">{product.price} ₽</p>
        </Link>
    );
};

export default ProductCard;
