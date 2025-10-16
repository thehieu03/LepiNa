import React from "react";
import { api } from "../api/client";

export default function AdminLogin({ onLogin }) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/api/auth/token", { username, password });
            const token = res.data?.access_token;
            if (token) {
                localStorage.setItem("lepina_token", token);
                onLogin?.();
            }
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    return (
        <div className="container py-16 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Đăng nhập Admin</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full border p-2 rounded" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="w-full border p-2 rounded" placeholder="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-red-500 text-sm">{String(error)}</p>}
                <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Đăng nhập</button>
            </form>
        </div>
    );
}


