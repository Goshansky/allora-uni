import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Home from "../pages/Home/Home.tsx";
import ProductPage from "../pages/ProductPage/ProductPage.tsx";
import CartPage from "../pages/CartPage/CartPage.tsx";
import Layout from "../components/Layout/Layout";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="products/:id" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
        </Route>
    </Routes>
);

export default AppRoutes;

