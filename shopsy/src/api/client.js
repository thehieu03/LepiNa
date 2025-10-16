import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5091";

export const api = axios.create({
  baseURL: API_BASE.replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lepina_token");

  // Do not attach Authorization header for public, unauthenticated endpoints
  // Normalize path without query string
  const urlPath = (config.url || "").split("?")[0];
  const PUBLIC_ENDPOINTS = new Set([
    "/api/products",
    "/api/products/with-active-price",
    "/api/feedback",
    "/api/analytics/top-products",
  ]);

  const isPublicEndpoint = PUBLIC_ENDPOINTS.has(urlPath);

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface basic diagnostics in development
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("API error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("lepina_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// ===== AUTHENTICATION =====
export const authAPI = {
  login: async (username, password) => {
    const res = await api.post("/api/auth/token", { username, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post("/api/auth/register", userData);
    return res.data;
  },
  refreshToken: async () => {
    const res = await api.post("/api/auth/refresh");
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("lepina_token");
  },
};

// ===== PRODUCTS =====
export const productsAPI = {
  getAll: async () => {
    const res = await api.get("/api/products");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  },
  create: async (product) => {
    const res = await api.post("/api/products", product);
    return res.data;
  },
  update: async (id, product) => {
    const res = await api.put(`/api/products/${id}`, product);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
  },
  getWithActivePrice: async () => {
    const res = await api.get("/api/products/with-active-price");
    return res.data;
  },
};

// ===== PRODUCT PRICES =====
export const productPricesAPI = {
  getAll: async () => {
    const res = await api.get("/api/productprices");
    return res.data;
  },
  getByProductId: async (productId) => {
    const res = await api.get(`/api/productprices/product/${productId}`);
    return res.data;
  },
  create: async (price) => {
    const res = await api.post("/api/productprices", price);
    return res.data;
  },
  update: async (id, price) => {
    const res = await api.put(`/api/productprices/${id}`, price);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/productprices/${id}`);
    return res.data;
  },
};

// ===== ORDERS =====
export const ordersAPI = {
  getAll: async () => {
    const res = await api.get("/api/orders");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/orders/${id}`);
    return res.data;
  },
  getDetail: async (id) => {
    const res = await api.get(`/api/orders/${id}/detail`);
    return res.data;
  },
  getByCustomerId: async (customerId) => {
    const res = await api.get(`/api/orders/customer/${customerId}`);
    return res.data;
  },
  create: async (order) => {
    const res = await api.post("/api/orders", order);
    return res.data;
  },
  checkout: async (checkoutPayload) => {
    const res = await api.post("/api/orders/checkout", checkoutPayload);
    return res.data;
  },
  update: async (id, order) => {
    const res = await api.put(`/api/orders/${id}`, order);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/api/orders/${id}/status`, { status });
    return res.data;
  },
  approve: async (id) => {
    const res = await api.post(`/api/orders/${id}/approve`);
    return res.data;
  },
  cancel: async (id) => {
    const res = await api.post(`/api/orders/${id}/cancel`);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/orders/${id}`);
    return res.data;
  },
};

// ===== ORDER ITEMS =====
export const orderItemsAPI = {
  getByOrderId: async (orderId) => {
    const res = await api.get(`/api/orderitems/order/${orderId}`);
    return res.data;
  },
  create: async (item) => {
    const res = await api.post("/api/orderitems", item);
    return res.data;
  },
  update: async (id, item) => {
    const res = await api.put(`/api/orderitems/${id}`, item);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/orderitems/${id}`);
    return res.data;
  },
};

// ===== CUSTOMERS =====
export const customersAPI = {
  getAll: async () => {
    const res = await api.get("/api/customers");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/customers/${id}`);
    return res.data;
  },
  create: async (customer) => {
    const res = await api.post("/api/customers", customer);
    return res.data;
  },
  update: async (id, customer) => {
    const res = await api.put(`/api/customers/${id}`, customer);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/customers/${id}`);
    return res.data;
  },
};

// ===== FEEDBACK =====
export const feedbackAPI = {
  getAll: async () => {
    const res = await api.get("/api/feedback");
    return res.data;
  },
  getByProductId: async (productId) => {
    const res = await api.get(`/api/feedback/product/${productId}`);
    return res.data;
  },
  getByCustomerId: async (customerId) => {
    const res = await api.get(`/api/feedback/customer/${customerId}`);
    return res.data;
  },
  create: async (feedback) => {
    const res = await api.post("/api/feedback", feedback);
    return res.data;
  },
  update: async (id, feedback) => {
    const res = await api.put(`/api/feedback/${id}`, feedback);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/feedback/${id}`);
    return res.data;
  },
};

// ===== MARKETING =====
export const marketingAPI = {
  campaigns: {
    getAll: async () => {
      const res = await api.get("/api/campaigns");
      return res.data;
    },
    create: async (campaign) => {
      const res = await api.post("/api/campaigns", campaign);
      return res.data;
    },
    update: async (id, campaign) => {
      const res = await api.put(`/api/campaigns/${id}`, campaign);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/campaigns/${id}`);
      return res.data;
    },
  },
  events: {
    getAll: async () => {
      const res = await api.get("/api/events");
      return res.data;
    },
    create: async (event) => {
      const res = await api.post("/api/events", event);
      return res.data;
    },
    update: async (id, event) => {
      const res = await api.put(`/api/events/${id}`, event);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/events/${id}`);
      return res.data;
    },
  },
  contentPosts: {
    getAll: async () => {
      const res = await api.get("/api/contentposts");
      return res.data;
    },
    create: async (post) => {
      const res = await api.post("/api/contentposts", post);
      return res.data;
    },
    update: async (id, post) => {
      const res = await api.put(`/api/contentposts/${id}`, post);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/contentposts/${id}`);
      return res.data;
    },
  },
  channels: {
    getAll: async () => {
      const res = await api.get("/api/marketingchannels");
      return res.data;
    },
    create: async (channel) => {
      const res = await api.post("/api/marketingchannels", channel);
      return res.data;
    },
    update: async (id, channel) => {
      const res = await api.put(`/api/marketingchannels/${id}`, channel);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/marketingchannels/${id}`);
      return res.data;
    },
  },
};

// ===== KPI & ANALYTICS =====
export const kpiAPI = {
  definitions: {
    getAll: async () => {
      const res = await api.get("/api/kpidefinitions");
      return res.data;
    },
    create: async (definition) => {
      const res = await api.post("/api/kpidefinitions", definition);
      return res.data;
    },
    update: async (id, definition) => {
      const res = await api.put(`/api/kpidefinitions/${id}`, definition);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/kpidefinitions/${id}`);
      return res.data;
    },
  },
  measurements: {
    getAll: async () => {
      const res = await api.get("/api/kpimeasurements");
      return res.data;
    },
    create: async (measurement) => {
      const res = await api.post("/api/kpimeasurements", measurement);
      return res.data;
    },
    update: async (id, measurement) => {
      const res = await api.put(`/api/kpimeasurements/${id}`, measurement);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/kpimeasurements/${id}`);
      return res.data;
    },
  },
  targets: {
    getAll: async () => {
      const res = await api.get("/api/weeklytargets");
      return res.data;
    },
    create: async (target) => {
      const res = await api.post("/api/weeklytargets", target);
      return res.data;
    },
    update: async (id, target) => {
      const res = await api.put(`/api/weeklytargets/${id}`, target);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/weeklytargets/${id}`);
      return res.data;
    },
  },
};

// ===== INTERNAL MANAGEMENT =====
export const internalAPI = {
  tasks: {
    getAll: async () => {
      const res = await api.get("/api/tasks");
      return res.data;
    },
    create: async (task) => {
      const res = await api.post("/api/tasks", task);
      return res.data;
    },
    update: async (id, task) => {
      const res = await api.put(`/api/tasks/${id}`, task);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/tasks/${id}`);
      return res.data;
    },
  },
  teamMembers: {
    getAll: async () => {
      const res = await api.get("/api/teammembers");
      return res.data;
    },
    create: async (member) => {
      const res = await api.post("/api/teammembers", member);
      return res.data;
    },
    update: async (id, member) => {
      const res = await api.put(`/api/teammembers/${id}`, member);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/teammembers/${id}`);
      return res.data;
    },
  },
  discountPolicies: {
    getAll: async () => {
      const res = await api.get("/api/discountpolicies");
      return res.data;
    },
    create: async (policy) => {
      const res = await api.post("/api/discountpolicies", policy);
      return res.data;
    },
    update: async (id, policy) => {
      const res = await api.put(`/api/discountpolicies/${id}`, policy);
      return res.data;
    },
    delete: async (id) => {
      const res = await api.delete(`/api/discountpolicies/${id}`);
      return res.data;
    },
  },
};

// ===== SURVEYS =====
export const surveysAPI = {
  getAll: async () => {
    const res = await api.get("/api/surveys");
    return res.data;
  },
  getStats: async () => {
    const res = await api.get("/api/surveys/stats");
    return res.data;
  },
  create: async (survey) => {
    const res = await api.post("/api/surveys", survey);
    return res.data;
  },
  update: async (id, survey) => {
    const res = await api.put(`/api/surveys/${id}`, survey);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/surveys/${id}`);
    return res.data;
  },
};

// ===== ANALYTICS =====
export const analyticsAPI = {
  getDashboard: async () => {
    try {
      const res = await api.get("/api/analytics/dashboard");
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return {
          totalProducts: 0,
          todayOrders: 0,
          newCustomers: 0,
          monthlyRevenue: 0,
          deliveredOrders: 0,
          shippedOrders: 0,
          pendingOrders: 0,
          cancelledOrders: 0,
          conversionRate: 0,
          averageOrderValue: 0,
          customerSatisfaction: 0,
        };
      }
      throw err;
    }
  },
  getRevenueChart: async (period = "30d") => {
    try {
      const res = await api.get(`/api/analytics/revenue?period=${period}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        // Return empty series to avoid UI errors
        return { labels: [], data: [] };
      }
      throw err;
    }
  },
  getTopProducts: async (limit = 10) => {
    try {
      const res = await api.get(`/api/analytics/top-products?limit=${limit}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },
  getOrderStats: async () => {
    try {
      const res = await api.get("/api/analytics/orders");
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  },
  getCustomerStats: async () => {
    try {
      const res = await api.get("/api/analytics/customers");
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  },
};

// Legacy functions for backward compatibility
export async function fetchProducts() {
  return productsAPI.getAll();
}

export async function createOrder(payload) {
  return ordersAPI.create(payload);
}

export async function fetchOrders() {
  return ordersAPI.getAll();
}

export async function fetchCustomers() {
  return customersAPI.getAll();
}

export async function fetchProductPrices() {
  return productPricesAPI.getAll();
}
