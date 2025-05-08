import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login({ email, password });
            localStorage.setItem("access_token", response.data.access_token);
            navigate("/");
        } catch (error) {
            console.error("Ошибка входа", error);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10">
            <h2 className="text-xl font-bold">Вход</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" className="input" />
            <button onClick={handleLogin} className="btn">Войти</button>
        </div>
    );
};

export default Login;
