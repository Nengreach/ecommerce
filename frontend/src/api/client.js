const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get or create persistent guest session id
 */
function getSessionId() {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Fetch wrapper with default headers and error handling
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const sessionId = getSessionId();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Session-Id': sessionId,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || 'Something went wrong with the request');
    error.status = response.status;
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    me: () => request('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // Categories
  categories: {
    getAll: () => request('/categories'),
    getBySlug: (slug) => request(`/categories/${slug}`),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      const queryString = searchParams.toString();
      return request(`/products${queryString ? `?${queryString}` : ''}`);
    },
    getFeatured: () => request('/products/featured'),
    getByIdOrSlug: (idOrSlug) => request(`/products/${idOrSlug}`),
  },

  // Cart
  cart: {
    get: () => request('/cart'),
    addItem: (productId, quantity = 1) =>
      request('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      }),
    updateQuantity: (itemId, quantity) =>
      request(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    removeItem: (itemId) =>
      request(`/cart/items/${itemId}`, {
        method: 'DELETE',
      }),
    clear: () => request('/cart/clear', { method: 'DELETE' }),
  },

  // Orders
  orders: {
    create: (orderData) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    getMyOrders: () => request('/orders'),
    getByNumber: (orderNumber) => request(`/orders/${orderNumber}`),
  },

  // Admin Management
  admin: {
    getStats: () => request('/admin/stats'),
    getOrders: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      const query = searchParams.toString();
      return request(`/admin/orders${query ? `?${query}` : ''}`);
    },
    updateOrderStatus: (id, status, payment_status) =>
      request(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, payment_status }),
      }),
    getProducts: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      const query = searchParams.toString();
      return request(`/admin/products${query ? `?${query}` : ''}`);
    },
    createProduct: (data) =>
      request('/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateProduct: (id, data) =>
      request(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteProduct: (id) =>
      request(`/admin/products/${id}`, {
        method: 'DELETE',
      }),
    createCategory: (data) =>
      request('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
