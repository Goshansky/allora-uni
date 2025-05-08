import { api } from "./client";

export const getCart = () => api.get("/cart");
export const addToCart = (productId: number) =>
    api.post("/cart/add", { product_id: productId });
export const removeFromCart = (productId: number) =>
    api.post("/cart/remove", { product_id: productId });
export const clearCart = () => api.post("/cart/clear");
