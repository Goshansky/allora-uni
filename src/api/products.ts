import { api } from "./client";

export const fetchProducts = () => api.get("/products");
export const fetchProductById = (id: string) => api.get(`/products/${id}`);
