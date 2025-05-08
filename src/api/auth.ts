import { api } from "./client";

export const login = (data: { email: string; password: string }) =>
    api.post("/login", data);

export const register = (data: { email: string; password: string }) =>
    api.post("/register", data);

export const getProfile = () => api.get("/profile");
