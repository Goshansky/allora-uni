import { api } from "./client";

export const fetchCategories = () => api.get("/categories");
export const fetchProductsByCategory = (categoryId: string) =>
    api.get(`/categories/${categoryId}/products`);
