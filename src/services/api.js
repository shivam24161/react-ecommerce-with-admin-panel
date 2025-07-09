const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return sessionStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Product API calls
export const productAPI = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/products/getAllProducts${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/getProduct/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Add new product
  addProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products/addProducts`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(productData),
    });

    return handleResponse(response);
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/editProduct/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(productData),
    });

    return handleResponse(response);
  },

  // update product status
  updateProductStatus: async (productId, active) => {
    const response = await fetch(`${API_BASE_URL}/products/updateProductStatus/${productId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ active })
    })
    return handleResponse(response);
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/deleteProduct/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },
};

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });

    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },
};

// Cart API calls
export const cartAPI = {
  getCart: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/cart/getCartitem/${userId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  addToCart: async (userId, productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/addCartItem`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        userId,
        products: [
          { productId, quantity }
        ]
      }),
    });
    return handleResponse(response);
  },

  updateCartItem: async (userId, productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/updateCart/${userId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });

    return handleResponse(response);
  },

  removeFromCart: async (userId, productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/deleteCartItem/${productId}?userId=${userId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },
};

// Admin API calls
export const adminAPI = {
  // Dashboard statistics
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // User management
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  getUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Order management
  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  getOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  updateOrderStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ status }),
    });

    return handleResponse(response);
  },

  // Product statistics
  getProductStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/products/stats`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },
};

// Order API calls
export const orderAPI = {
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/order/createOrder`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },
}; 