import React from "react";
import PlaceholderImg from "../assets/image.png";
import {
  api,
  fetchProducts,
  fetchOrders,
  fetchCustomers,
  fetchProductPrices,
} from "../api/client";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  const [name, setName] = React.useState("");
  const [origin, setOrigin] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [prices, setPrices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(null);

  const token = localStorage.getItem("lepina_token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setItems(Array.isArray(data) ? data : []);
      try {
        const od = await fetchOrders();
        setOrders(Array.isArray(od) ? od : []);
      } catch (e) {
        // ignore non-critical errors when loading dashboard lists
      }
      try {
        const cs = await fetchCustomers();
        setCustomers(Array.isArray(cs) ? cs : []);
      } catch (e) {
        // ignore non-critical errors when loading dashboard lists
      }
      try {
        const pr = await fetchProductPrices();
        setPrices(Array.isArray(pr) ? pr : []);
      } catch (e) {
        // ignore non-critical errors when loading dashboard lists
      }
    } catch (e) {
      setMessage(
        "Không tải được danh sách: " + (e.response?.data || e.message)
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        name: name,
        origin,
        description,
        image_url: imageUrl,
        price_vnd: price ? Number(price) : null,
      };
      if (editing) {
        await api.put(`/api/products/${editing.id}`, {
          Name: name,
          Origin: origin,
          Description: description,
          ImageUrl: imageUrl,
          PriceVnd: price ? Number(price) : null,
        });
        setMessage("Cập nhật sản phẩm thành công");
      } else {
        await api.post("/api/products", payload);
        setMessage("Tạo sản phẩm thành công");
      }
      setName("");
      setOrigin("");
      setDescription("");
      setImageUrl("");
      setPrice("");
      setEditing(null);
      load();
    } catch (err) {
      setMessage("Lỗi: " + (err.response?.data || err.message));
    }
  };

  const onEdit = (p) => {
    setEditing(p);
    setName(p.name || p.Name || "");
    setOrigin(p.origin || p.Origin || "");
    setDescription(p.description || p.Description || "");
    setImageUrl(p.image_url || p.imageUrl || "");
    setPrice(p.price_vnd || p.priceVnd || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      load();
    } catch (e) {
      alert("Xóa thất bại: " + (e.response?.data || e.message));
    }
  };

  const [section, setSection] = React.useState("products");
  return (
    <div className="container py-10 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-extrabold mb-6">Bảng điều khiển Admin</h1>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-1">
          <AdminSidebar active={section} onSelect={setSection} />
        </div>
        {section === "products" && (
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                className="w-full border p-2 rounded text-gray-900"
                placeholder="Tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="w-full border p-2 rounded text-gray-900"
                placeholder="Nguồn gốc/Mô tả ngắn"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
              <textarea
                className="w-full border p-2 rounded text-gray-900"
                placeholder="Mô tả chi tiết"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded text-gray-900"
                placeholder="Ảnh (URL)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="h-32 object-contain rounded border"
                />
              )}
              <input
                className="w-full border p-2 rounded text-gray-900"
                placeholder="Giá (VND)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="bg-primary text-white px-4 py-2 rounded"
                  type="submit"
                >
                  {editing ? "Lưu" : "Tạo"}
                </button>
                {editing && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded border"
                    onClick={() => {
                      setEditing(null);
                      setName("");
                      setOrigin("");
                      setDescription("");
                      setImageUrl("");
                      setPrice("");
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
            {message && <p className="mt-3 text-sm">{message}</p>}
          </div>
        )}

        {section === "products" && (
          <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
              <button className="text-sm underline" onClick={load}>
                Tải lại
              </button>
            </div>
            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-2 text-left">Ảnh</th>
                      <th className="p-2 text-left">Tên</th>
                      <th className="p-2 text-left">Giá</th>
                      <th className="p-2 text-left">Nguồn gốc</th>
                      <th className="p-2">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr
                        key={it.id}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="p-2">
                          <img
                            src={it.image_url || it.imageUrl || PlaceholderImg}
                            className="h-12 w-12 object-cover rounded"
                          />
                        </td>
                        <td className="p-2 font-medium">{it.name}</td>
                        <td className="p-2">
                          {new Intl.NumberFormat("vi-VN").format(
                            it.price_vnd || 0
                          )}{" "}
                          đ
                        </td>
                        <td className="p-2">{it.origin}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 rounded bg-blue-600 text-white"
                              onClick={() => onEdit(it)}
                            >
                              Sửa
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white"
                              onClick={() => onDelete(it.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {section === "orders" && (
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
              <button className="text-sm underline" onClick={load}>
                Tải lại
              </button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left">Mã</th>
                    <th className="p-2 text-left">Ngày</th>
                    <th className="p-2 text-left">Kênh</th>
                    <th className="p-2 text-left">Trạng thái</th>
                    <th className="p-2 text-right">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-2">#{o.id}</td>
                      <td className="p-2">
                        {new Date(o.orderDate || o.order_date).toLocaleString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="p-2">{o.channel}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2 text-right">
                        {new Intl.NumberFormat("vi-VN").format(
                          o.totalAmountVnd || o.total_amount_vnd || 0
                        )}{" "}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "prices" && (
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Giá sản phẩm</h2>
              <button className="text-sm underline" onClick={load}>
                Tải lại
              </button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left">Sản phẩm</th>
                    <th className="p-2 text-right">Giá</th>
                    <th className="p-2 text-left">Từ ngày</th>
                    <th className="p-2 text-left">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-2">#{p.productId}</td>
                      <td className="p-2 text-right">
                        {new Intl.NumberFormat("vi-VN").format(p.priceVnd)} đ
                      </td>
                      <td className="p-2">{p.effectiveFrom}</td>
                      <td className="p-2">{p.isActive ? "✓" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "customers" && (
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Khách hàng</h2>
              <button className="text-sm underline" onClick={load}>
                Tải lại
              </button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left">Tên</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Nguồn</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.phone}</td>
                      <td className="p-2">
                        {c.sourceChannel || c.source_channel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
