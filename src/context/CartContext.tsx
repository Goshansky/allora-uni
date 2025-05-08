import { createContext, useContext, useEffect, useState } from "react";
import type {CartItem} from "../types/cart";
import { getCart, addToCart, removeFromCart, clearCart } from "../api/cart";

interface CartContextProps {
    cart: CartItem[];
    refreshCart: () => void;
    add: (productId: number) => void;
    remove: (productId: number) => void;
    clear: () => void;
}

const CartContext = createContext<CartContextProps | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const refreshCart = () => {
        getCart().then((res) => setCart(res.data));
    };

    const add = (productId: number) => {
        addToCart(productId).then(() => refreshCart());
    };

    const remove = (productId: number) => {
        removeFromCart(productId).then(() => refreshCart());
    };

    const clear = () => {
        clearCart().then(() => refreshCart());
    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, refreshCart, add, remove, clear }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("CartContext not found");
    return context;
};
