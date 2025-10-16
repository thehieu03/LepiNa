import React from "react";
import PlaceholderImg from "../../assets/image.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsAPI } from "../../api/client";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

const ProductsManagement = () => {
  const normalizeStatus = (value) => {
    if (!value) return "";
    const v = String(value).trim().toLowerCase();
    // Accept backend codes
    if (v === "draft") return "Draft";
    if (v === "testing") return "Testing";
    if (v === "launched") return "Launched";
    // Map Vietnamese UI labels to backend codes
    if (v === "nháp" || v === "nhap") return "Draft";
    if (v === "thử nghiệm" || v === "thu nghiem") return "Testing";
    if (v === "hoạt động" || v === "hoat dong") return "Launched";
    return "";
  };

  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    name: "",
    description: "",
    origin: "",
    // default chọn "Launched" cho UI; có thể bỏ status bằng cách xóa trước khi gửi
    status: "Launched",
    price_vnd: 0,
    imageData: "",
    imageMimeType: "",
  });
  const [editForm, setEditForm] = React.useState({
    id: null,
    name: "",
    description: "",
    origin: "",
    status: "Active",
    price_vnd: 0,
    imageData: "",
    imageMimeType: "",
  });
  const [editPreviewSrc, setEditPreviewSrc] = React.useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: productsAPI.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => productsAPI.update(id, payload),
    onSuccess: (updated, variables) => {
      // Merge response if present; otherwise optimistically apply submitted payload
      const fallback = { id: variables.id, ...variables.payload };
      const merged = updated && updated.id ? updated : fallback;
      queryClient.setQueryData(["admin-products"], (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((p) =>
          p.id === merged.id
            ? {
                ...p,
                ...merged,
                price_vnd:
                  typeof merged.price_vnd === "number"
                    ? merged.price_vnd
                    : typeof merged.priceVnd === "number"
                    ? merged.priceVnd
                    : p.price_vnd,
              }
            : p
        );
      });
      setIsEditOpen(false);
    },
    onError: (error, variables) => {
      // eslint-disable-next-line no-console
      console.error("Update product failed", {
        id: variables?.id,
        payload: variables?.payload,
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      toast.error(
        String(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "Cập nhật thất bại"
        )
      );
    },
    onSettled: () => {
      // Ensure eventual consistency if server transforms fields
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
        exact: true,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => productsAPI.create(payload),
    onSuccess: (created) => {
      queryClient.setQueryData(["admin-products"], (old) => {
        if (!Array.isArray(old)) return [created];
        return [created, ...old];
      });
      setIsCreateOpen(false);
      setCreateForm({
        name: "",
        description: "",
        origin: "",
        status: "Active",
        price_vnd: 0,
        imageData: "",
        imageMimeType: "",
      });
    },
  });

  const openEdit = async (product) => {
    // Open modal quickly with current list data
    setIsEditOpen(true);
    setEditForm((prev) => ({
      ...prev,
      id: product.id,
      name: product.name || "",
      description: product.description || "",
      origin: product.origin || "",
      status: normalizeStatus(product.status) || "Launched",
      // Normalize legacy lowercase values to title case expected by DB constraint
      // e.g., "active" -> "Active", "inactive" -> "Inactive"
      price_vnd:
        typeof product.price_vnd === "number"
          ? product.price_vnd
          : typeof product.priceVnd === "number"
          ? product.priceVnd
          : 0,
    }));
    const quickPreview =
      (product.imageData && product.imageMimeType
        ? `data:${product.imageMimeType};base64,${product.imageData}`
        : null) ||
      product.image_url ||
      product.imageUrl ||
      PlaceholderImg;
    setEditPreviewSrc(quickPreview);

    // Fetch full detail to ensure latest image and price
    try {
      const full = await productsAPI.getById(product.id);
      setEditForm((prev) => ({
        ...prev,
        name: full.name || prev.name,
        description: full.description ?? prev.description,
        origin: full.origin ?? prev.origin,
        status: normalizeStatus(full.status || prev.status) || prev.status,
        price_vnd:
          typeof full.price_vnd === "number"
            ? full.price_vnd
            : typeof full.priceVnd === "number"
            ? full.priceVnd
            : prev.price_vnd,
        imageData: full.imageData || "",
        imageMimeType: full.imageMimeType || "",
      }));
      const preview =
        (full.imageData && full.imageMimeType
          ? `data:${full.imageMimeType};base64,${full.imageData}`
          : null) || PlaceholderImg;
      setEditPreviewSrc(preview);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Fetch product detail failed", err);
      toast.error("Không tải được chi tiết sản phẩm");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "price_vnd" ? Number(value) : value,
    }));
  };

  const submitEdit = (e) => {
    e.preventDefault();
    const { id } = editForm;
    // Only send fields expected by backend Product model
    const payload = {
      name: editForm.name,
      description: editForm.description || null,
      origin: editForm.origin || null,
      // Only include status when non-empty; otherwise let DB default
      ...(normalizeStatus(editForm.status)
        ? { status: normalizeStatus(editForm.status) }
        : {}),
      // include price for PUT endpoints that require full entity
      price_vnd:
        typeof editForm.price_vnd === "number" ? editForm.price_vnd : 0,
      // also send PascalCase variant for ASP.NET models
      priceVnd: typeof editForm.price_vnd === "number" ? editForm.price_vnd : 0,
      id,
      imageData: editForm.imageData || null,
      imageMimeType: editForm.imageMimeType || null,
    };
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.log("Submitting product update", { id, payload });
    }
    updateMutation.mutate({ id, payload });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      // result looks like: data:<mime>;base64,<base64Data>
      const commaIdx = result.indexOf(",");
      if (commaIdx === -1) return;
      const header = result.slice(0, commaIdx); // data:<mime>;base64
      const base64 = result.slice(commaIdx + 1);
      const mimeMatch = header.match(/^data:(.*?);base64$/);
      const mime = mimeMatch?.[1] || file.type || "application/octet-stream";
      setEditForm((prev) => ({
        ...prev,
        imageData: base64,
        imageMimeType: mime,
      }));
      // Update preview instantly
      setEditPreviewSrc(`data:${mime};base64,${base64}`);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const commaIdx = result.indexOf(",");
      if (commaIdx === -1) return;
      const header = result.slice(0, commaIdx);
      const base64 = result.slice(commaIdx + 1);
      const mimeMatch = header.match(/^data:(.*?);base64$/);
      const mime = mimeMatch?.[1] || file.type || "application/octet-stream";
      setCreateForm((prev) => ({
        ...prev,
        imageData: base64,
        imageMimeType: mime,
      }));
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý sản phẩm
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý danh mục sản phẩm và thông tin chi tiết
          </p>
        </div>
        <button
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          onClick={() => setIsCreateOpen(true)}
        >
          <FiPlus className="h-5 w-5" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          (product.imageData && product.imageMimeType
                            ? `data:${product.imageMimeType};base64,${product.imageData}`
                            : null) ||
                          product.image_url ||
                          product.imageUrl ||
                          PlaceholderImg
                        }
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = PlaceholderImg;
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.origin}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Intl.NumberFormat("vi-VN").format(
                      (typeof product.price_vnd === "number"
                        ? product.price_vnd
                        : product.priceVnd) || 0
                    )}{" "}
                    đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => openEdit(product)}
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa sản phẩm</h3>
            <form onSubmit={submitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Xuất xứ
                </label>
                <input
                  name="origin"
                  value={editForm.origin}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="Launched">Hoạt động</option>
                  <option value="Draft">Nháp</option>
                  <option value="Testing">Thử nghiệm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giá (VND)
                </label>
                <input
                  type="number"
                  name="price_vnd"
                  value={editForm.price_vnd}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  min={0}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hoặc tải ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <img
                  src={editPreviewSrc || PlaceholderImg}
                  alt="preview"
                  className="mt-2 h-24 w-24 object-cover rounded"
                  onError={(e) => (e.currentTarget.src = PlaceholderImg)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  onClick={() => setIsEditOpen(false)}
                  disabled={updateMutation.isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                >
                  {updateMutation.isLoading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
              {updateMutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  {updateMutation.error?.response?.data?.detail ||
                    updateMutation.error?.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const payload = {
                  name: createForm.name,
                  description: createForm.description || null,
                  origin: createForm.origin || null,
                  ...(normalizeStatus(createForm.status)
                    ? { status: normalizeStatus(createForm.status) }
                    : {}),
                  price_vnd:
                    typeof createForm.price_vnd === "number"
                      ? createForm.price_vnd
                      : 0,
                  imageData: createForm.imageData || null,
                  imageMimeType: createForm.imageMimeType || null,
                };
                createMutation.mutate(payload);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Xuất xứ
                </label>
                <input
                  value={createForm.origin}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, origin: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trạng thái
                </label>
                <select
                  value={createForm.status}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="Launched">Hoạt động</option>
                  <option value="Draft">Nháp</option>
                  <option value="Testing">Thử nghiệm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giá (VND)
                </label>
                <input
                  type="number"
                  min={0}
                  value={createForm.price_vnd}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      price_vnd: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hoặc tải ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCreateFileChange}
                />
                {createForm.imageData && (
                  <img
                    src={`data:${createForm.imageMimeType};base64,${createForm.imageData}`}
                    alt="preview"
                    className="mt-2 h-24 w-24 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={createMutation.isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                >
                  {createMutation.isLoading ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
              {createMutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  {createMutation.error?.response?.data?.detail ||
                    createMutation.error?.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
