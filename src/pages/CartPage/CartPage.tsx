import { useCart } from "../../context/CartContext.tsx";
import { Link } from "react-router-dom";

const CartPage = () => {
    const { cart, add, remove, clear } = useCart();

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Корзина</h1>

            {cart.length === 0 ? (
                <p>Корзина пуста.</p>
            ) : (
                <>
                    <ul className="space-y-4 mb-6">
                        {cart.map(({ product, quantity }) => (
                            <li key={product.id} className="flex items-center gap-4 border p-4 rounded">
                                <img src={product.image_url || "/placeholder.jpg"} alt={product.name} className="w-16 h-16 object-cover" />
                                <div className="flex-1">
                                    <Link to={`/products/${product.id}`} className="font-bold">{product.name}</Link>
                                    <div>{product.price} ₽ x {quantity}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => remove(product.id)} className="px-2 py-1 bg-red-500 text-white rounded">-</button>
                                    <button onClick={() => add(product.id)} className="px-2 py-1 bg-green-500 text-white rounded">+</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="text-xl font-semibold mb-4">Итого: {total} ₽</div>

                    <div className="flex gap-4">
                        <button onClick={clear} className="px-4 py-2 bg-gray-300 rounded">Очистить</button>
                        <Link to="/checkout" className="px-4 py-2 bg-blue-600 text-white rounded">Оформить заказ</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
