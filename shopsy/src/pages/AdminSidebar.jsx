import React from "react";

export default function AdminSidebar({ active, onSelect }) {
    const items = [
        { id: "products", label: "Sản phẩm" },
        { id: "orders", label: "Đơn hàng" },
        { id: "prices", label: "Giá sản phẩm" },
        { id: "customers", label: "Khách hàng" },
    ];
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
            <h3 className="text-lg font-semibold mb-3">Quản lý</h3>
            <ul className="space-y-1">
                {items.map((it) => (
                    <li key={it.id}>
                        <button
                            className={`w-full text-left px-3 py-2 rounded ${active === it.id ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            onClick={() => onSelect(it.id)}
                        >
                            {it.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}


